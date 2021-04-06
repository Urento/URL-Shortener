import redis from "../db/redis";
import * as express from "express";
require("dotenv-safe").config();

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

exports.create = async function (req: express.Request, res: express.Response) {
  const id = generateId(process.env.URL_ID_LENGTH);
  if (!validURL(req.body.url)) {
    res.status(400).send({ message: "URL not valid" });
    return;
  }
  await redis.redis.set(id, req.body.url);
  res.status(200).send({ message: "Successfully created", id: id });
};

exports.getURL = async function (req: express.Request, res: express.Response) {
  const r = await redis.redis.get(req.body.id);
  if (r === null) {
    res.status(400).send({ message: "Not Able to find URL" });
  } else {
    res.status(200).send({ url: await redis.redis.get(req.body.id) });
  }
};
