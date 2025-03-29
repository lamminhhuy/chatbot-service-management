import { env } from "@/configs/envConfig";
import Redis from "ioredis";

class RedisClient {
  private static instance: Redis | null = null;
  
  private constructor() {}

  public static async getInstance(): Promise<Redis> {
    if (!this.instance) {
      this.instance = new Redis(env.REDIS_URL, {
        reconnectOnError: (err) => {
          console.error("Redis error:", err);
          return true;
        },
      });

      return new Promise((resolve, reject) => {
        this.instance!.on("connect", () => {
          console.log("Redis connected");
          resolve(this.instance!);
        });

        this.instance!.on("error", (err) => {
          console.error("Redis connection error:", err);
          reject(err);
        });
      });
    }

    return this.instance;
  }
}

export default RedisClient;
export const redisInstance = await RedisClient.getInstance();
