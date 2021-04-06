import Redis from "ioredis";
require("dotenv-safe").config();
var redis = new Redis({
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
});

export default {
  redis,
};
