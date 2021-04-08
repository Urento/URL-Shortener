import express from "express";
import redis from "./db/redis";
import bodyParser from "body-parser";
import cors from "cors";
require("dotenv-safe").config();

const main = async () => {
  redis;

  const app = express();
  const port = process.env.SERVER_PORT;

  const requestLogger = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.log(`${req.method} ${req.path}  ${res.statusCode}`);
    next();
  };

  app.set("trust proxy", true);
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(requestLogger);

  const shortenerRoutes = require("./routes/shortener.route");
  shortenerRoutes(app);

  app.listen(port, () => console.log(`Listening on Port ${port}`));
};

main().catch((err) => console.error(err));
