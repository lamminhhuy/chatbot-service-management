import Redis from "ioredis";
import { redisInstance } from "../../database/redisClient";

export interface IOTPService {
  setOTP(email: string, otp: string, ttl: number): Promise<void>;
  getOTP(email: string): Promise<string | null>;
  deleteOTP(email: string): Promise<void>;
}

export class RedisOTPService implements IOTPService {
  private redisClient: Redis;

  constructor() {
    this.redisClient = redisInstance as unknown as Redis;
   
  }

  static async create(): Promise<RedisOTPService> {
    const redisClient = await redisInstance;
    const storage = new RedisOTPService();
    storage.redisClient = redisClient;
    return storage;
  }

  async setOTP(email: string, otp: string, ttl: number): Promise<void> {
    await this.redisClient.setex(email, ttl, otp);
  }

  async getOTP(email: string): Promise<string | null> {
    return this.redisClient.get(email);
  }

  async deleteOTP(email: string): Promise<void> {
    await this.redisClient.del(email);
  }
}