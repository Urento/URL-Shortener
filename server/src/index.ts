import express from "express";
import redis from "./db/redis";
require("dotenv-safe").config();

const main = async () => {
  redis;

  const app = express();

  app.listen(process.env.SERVER_PORT);
};

main().catch((err) => console.error(err));
