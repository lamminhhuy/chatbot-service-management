import { createClient, RedisClientType } from "redis";
import { env } from "../../configs/envConfig";

export class RedisClient {
  private static instance: RedisClientType | null = null;
  private static isConnected: boolean = false;

  public static getInstance(): RedisClientType {
    if (!RedisClient.instance) {
      if (!env.REDIS_URL) {
        throw new Error("Redis URL is not defined in the configuration.");
      }

      RedisClient.instance = createClient({ url: env.REDIS_URL });

      RedisClient.instance.on("ready", () => {
        RedisClient.isConnected = true;
        console.log("Connected to Redis successfully!");
      });

      RedisClient.instance.on("error", (error) => {
        RedisClient.isConnected = false;
        console.error("Redis connection error:", error);
      });

      RedisClient.instance.connect().catch((error) => {
        RedisClient.isConnected = false;
        console.error("Failed to connect to Redis:", error);
      });
    }

    return RedisClient.instance;
  }

  public static isConnectedToRedis(): boolean {
    return RedisClient.isConnected;
  }
}

export const redisInstance = RedisClient.getInstance()