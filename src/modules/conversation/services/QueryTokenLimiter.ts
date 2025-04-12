import RedisClient from "@/database/redisClient";
import { inject, injectable } from "tsyringe";
import { ITokenConfig } from "../interfaces/ITokenConfig";
import Redis from "ioredis";
import { ITokenLimiter } from "../interfaces/ITokenLimiter";

const defaultTokenConfig: ITokenConfig = {
    tokenExpireTime: 3600,
    tokenKeyPrefix: 'chatbot:token'
};

@injectable()
export class UserTokenLimiter implements ITokenLimiter {
    private readonly config: ITokenConfig;
  
    constructor(
    
      @inject('IRedisClient') private redisClient: Redis,
      @inject('TokenConfig') config: ITokenConfig = defaultTokenConfig
    ) {
      this.redisClient = redisClient;
      this.config = config;
    }
  
    async checkToken(userId: number, userMaxTokens: number): Promise<boolean> {
      try {
        const tokenKey = this.getTokenKey(userId);
        const currentTokens = await this.getCurrentTokenCount(tokenKey);
        
        if (currentTokens === null) {
          await this.initializeUserToken(userId,userMaxTokens, this.config.tokenExpireTime);
          return true;
        }
  
        if (currentTokens >= userMaxTokens) {
          return false;
        }
  
        await this.redisClient.incr(tokenKey);
        return true;
      } catch (error) {
        console.error(`Token check failed for user ${userId}:`, error);
        throw new Error('Token verification failed');
      }
    }
  
    async getRemainingTokens(userId: number, userMaxTokens: number): Promise<number> {
      const tokenKey = this.getTokenKey(userId);
      const currentTokens = await this.getCurrentTokenCount(tokenKey);
      
      if (currentTokens === null) {
        return userMaxTokens;
      }
      
      return Math.max(0, userMaxTokens - currentTokens);
    }
  
    async resetToken(userId: number): Promise<void> {
      const tokenKey = this.getTokenKey(userId);
      await this.redisClient.del(tokenKey);
    }
  
    async initializeUserToken(userId: number, userMaxTokens: number, tokenExpireTime: number): Promise<void> {
      const tokenKey = this.getTokenKey(userId);
      await this.redisClient.set(tokenKey, userMaxTokens.toString());
      await this.redisClient.expire(tokenKey, tokenExpireTime);
    }
  
    private getTokenKey(userId: number): string {
      return `${this.config.tokenKeyPrefix}${userId}`;
    }
  
    private async getCurrentTokenCount(tokenKey: string): Promise<number | null> {
      const value = await this.redisClient.get(tokenKey);
      return value === null ? null : parseInt(value, 10);
    }
  }