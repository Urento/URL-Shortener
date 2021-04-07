import express from "express";
import redis from "./db/redis";
import bodyParser from "body-parser";
require("dotenv-safe").config();

const main = async () => {
  redis;

  const app = express();
  const port = process.env.SERVER_PORT;

  app.use(bodyParser.urlencoded({ extended: false }));

  var shortenerRoutes = require("./routes/shortener.route");
  shortenerRoutes(app);

  app.listen(port, () => console.log(`Listening on Port ${port}`));
};

main().catch((err) => console.error(err));
