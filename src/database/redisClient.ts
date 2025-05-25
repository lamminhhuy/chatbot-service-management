import { env } from "@/configs/envConfig";
import Redis from "ioredis";

class RedisClient {
  private static instance: Redis | null = null;
  private static isConnecting: boolean = false;

  private constructor() {}

  private static initializeConnection(): Redis {
    const redis = new Redis({
      host: env.REDIS_HOST ,
      port: env.REDIS_PORT,    
      reconnectOnError: (err) => {
        console.error("Redis error:", err);
        return true;
      },
    });

    redis.on("close", () => {
      console.log("Redis disconnected!");
    });
    redis.on("connect", () => {
      console.log("Redis connected");
    });

    redis.on("error", (err) => {
      console.error("Redis connection error vcl:", err);
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