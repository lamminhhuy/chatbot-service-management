import Redis from "ioredis";
import { redisInstance } from "../../database/redisClient";
import { ICacheProvider } from "./CacheProvider.type";

 class CacheProvider<T> implements ICacheProvider<T> {
    private redisClient: Redis;
    
    constructor() {
      this.redisClient = redisInstance as unknown as Redis;
     
    }
    async set(key: string, value: T): Promise<void> {
      await this.redisClient.set(key, JSON.stringify(value));
    }
    
    async get(key: string): Promise<T | null> {
      const value = await this.redisClient.get(key);
      return value ? JSON.parse(value) : null;
    }
    
    async delete(key: string): Promise<void> {
      await this.redisClient.del(key);
    }
    async setEx(key: string, value: T, ttl: number): Promise<void> {
      await this.redisClient.setex(key, ttl, JSON.stringify(value));
    }
  }

  export default CacheProvider;