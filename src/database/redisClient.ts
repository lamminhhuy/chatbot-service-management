import { env } from "@/configs/envConfig";
import { createClient, RedisClientType } from "redis";

class RedisClient {
  private static instance: RedisClientType;

  private constructor() {}

  public static getInstance(): RedisClientType {
    if (!this.instance) {
      this.instance = createClient({
        url: env.REDIS_URL,
        pingInterval: 3000,
      });

      this.instance.on("connect", () => console.log("Redis connected"));
      this.instance.on("error", (err) => console.error("Redis error:", err));

      this.instance.connect().catch(console.error);
    }

    return this.instance;
  }
}

export default RedisClient;

export const redisInstance = RedisClient.getInstance();
