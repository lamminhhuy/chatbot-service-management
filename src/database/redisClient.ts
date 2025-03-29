import { env } from "@/configs/envConfig";
import Redis from "ioredis";

class RedisClient {
  private static instance: Redis | null = null;
  private static isConnecting: boolean = false;

  private constructor() {
  }

  private static initializeConnection(): Redis {
    const redis = new Redis(env.REDIS_URL, {
      reconnectOnError: (err) => {
        console.error("Redis error:", err);
        return true;
      },
    });

    redis.on("connect", () => {
      console.log("Redis connected");
    });

    redis.on("error", (err) => {
      console.error("Redis connection error:", err);
    });

    return redis;
  }

  public static getInstance(): Redis {
    if (!RedisClient.instance && !RedisClient.isConnecting) {
      RedisClient.isConnecting = true;
      RedisClient.instance = RedisClient.initializeConnection();
      RedisClient.isConnecting = false;
    }
    
    if (!RedisClient.instance) {
      throw new Error("Redis instance not initialized");
    }

    return RedisClient.instance;
  }
}

export const redisInstance = RedisClient.getInstance();

export default RedisClient;