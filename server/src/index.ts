import express from "express";
import redis from "./db/redis";
import bodyParser from "body-parser";
require("dotenv-safe").config();

const main = async () => {
  redis;

  const app = express();

  app.use(bodyParser.urlencoded({ extended: false }));

  var shortenerRoutes = require("./routes/shortener.route");
  shortenerRoutes(app);

  app.listen(process.env.SERVER_PORT);
};

main().catch((err) => console.error(err));
