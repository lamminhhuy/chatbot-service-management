import { env } from "@/configs/envConfig";
import Redis from "ioredis";

class RedisClient {
  private static instance: Redis;

  private constructor() {}

  public static getInstance(): Redis {
    if (!this.instance) {
      this.instance = new Redis(env.REDIS_URL, {
        reconnectOnError: (err) => {
          console.error("Redis error:", err);
          return true; 
        },
      });

      this.instance.on("connect", () => console.log("Redis connected"));
      this.instance.on("error", (err) => console.error("Redis error:", err));
    }

    return this.instance;
  }
}

export default RedisClient;

export const redisInstance = RedisClient.getInstance();
