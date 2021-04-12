import Redis from "redis";
require("dotenv-safe").config();

const redisClientOptions = {
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
};
var redis = Redis.createClient(redisClientOptions);

redis.on("error", (err) => {
  console.error(err);
});

export default {
  redis,
};
