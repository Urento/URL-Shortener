import redis from "../db/redis";
require("dotenv-safe").config();

export default class Shortener {
  generateId(length: number) {
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
  }

  async create(url: string) {
    const id = this.generateId(process.env.URL_ID_LENGTH);
    redis.redis.set(id, url);
    return id;
  }

  async getURL(id: string) {
    return await redis.redis.get(id);
  }
}
