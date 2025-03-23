import { RedisClientType } from "redis";
import { redisInstance } from "../../database/redisClient";

export interface IOTPStorage {
  setOTP(email: string, otp: string, ttl: number): Promise<void>;
  getOTP(email: string): Promise<string | null>;
  deleteOTP(email: string): Promise<void>;
}

export class RedisOTPStorage implements IOTPStorage {
  private redisClient: RedisClientType;

  constructor() {
    this.redisClient = redisInstance as unknown as RedisClientType;
   
  }

  static async create(): Promise<RedisOTPStorage> {
    const redisClient = await redisInstance;
    const storage = new RedisOTPStorage();
    storage.redisClient = redisClient;
    return storage;
  }

  async setOTP(email: string, otp: string, ttl: number): Promise<void> {
    await this.redisClient.setEx(email, ttl, otp);
  }

  async getOTP(email: string): Promise<string | null> {
    return this.redisClient.get(email);
  }

  async deleteOTP(email: string): Promise<void> {
    await this.redisClient.del(email);
  }
}