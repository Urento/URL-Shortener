import redis from "../db/redis";
import * as express from "express";
import crypto from "crypto";
require("dotenv-safe").config();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;

const generateId = (length: number) => {
  var result = [];
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join("");
};

const validURL = (str: string) => {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
};

const encrypt = (text: string) => {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

/**
 * Create a Redis Entry with the encrypted shortened URL and validate if it actually is an url
 * Create an extra entry to later check if the url already exists to avoid duplication
 */
exports.create = async function (req: express.Request, res: express.Response) {
  const url: string = req.body.url;

  // check if URL is valid
  if (!validURL(url)) {
    res.status(400).send({ error: true, message: "URL is not valid" });
    return;
  }

  redis.redis.exists(`url:${url}`, (err, exists) => {
    if (err) {
      res.status(400).send({
        error: true,
        message: err.message,
      });
      console.log(err);
      return;
    }
    if (exists === null) {
      res.status(400).send({
        error: true,
        message:
          "URL from the Database was null. Please contact a Server Administrator",
      });
      return;
    }
    if (!exists) {
      const id = generateId(process.env.URL_ID_LENGTH);
      //TODO: Make this more elegant to check for existing urls
      redis.redis.set(`url:${url}`, id);
      // encrypt url and send to redis
      redis.redis.set(`id:${id}`, encrypt(url));
      res.status(200).send({ id: id });
    } else {
      redis.redis.get(`url:${url}`, (err, reply) => {
        if (err || reply === null) {
          if (err !== null) console.error(err);
          res.status(400).send({
            error: true,
            message:
              "URL from the Database was null. Please contact a Server Administrator",
          });
          return;
        }
        res.status(200).send({ id: reply });
        return;
      });
    }
    //return exists === 0 ? false : true;
  });
};

const decrypt = (text: string) => {
  let textParts = text.split(":");
  let iv = Buffer.from(textParts.shift()!, "hex");
  let encryptedText = Buffer.from(textParts.join(":"), "hex");

  let decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

/**
 * Get the actual URL from the Data and decrypt it
 */
exports.getURL = async function (req: express.Request, res: express.Response) {
  redis.redis.get(`id:${req.params.id}`, (err, reply) => {
    if (err)
      res.status(400).send({ error: true, message: "Not Able to find URL" });
    if (reply === null)
      res.status(400).send({ error: true, message: "Not Able to find URL" });
    res.status(200).send({ url: decrypt(reply!) });
  });
};
