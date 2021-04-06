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

exports.create = async function (req: express.Request, res: express.Response) {
  const id = generateId(process.env.URL_ID_LENGTH);
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
