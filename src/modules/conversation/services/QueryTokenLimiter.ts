import RedisClient from "@/database/redisClient";
import { inject, injectable } from "tsyringe";
import { ITokenConfig } from "../interfaces/ITokenConfig";
import Redis from "ioredis";
import { ITokenLimiter } from "../interfaces/ITokenLimiter";
import { IUserSubscriptionService } from "@/modules/subscription/interfaces/IUsersubscriptionService";
import UserSubscriptionService from "@/modules/subscription/services/UserSubscriptionService";


@injectable()
export class UserTokenLimiter implements ITokenLimiter {
    private readonly config: ITokenConfig;
  
    constructor(
  @inject('IRedisClient') private redisClient: Redis,
  config: ITokenConfig,
  @inject(UserSubscriptionService) private userSubscriptionService: UserSubscriptionService
    ) {
  this.redisClient = redisClient;
  this.config = config;
}
  
    async checkToken(userId: number): Promise<boolean> {
      const userSubscription = await this.userSubscriptionService.getActiveUserSubsription(userId);
      if(!userSubscription) {
        throw new Error('User subscription not found');
      }

      const userMaxTokens = userSubscription.subscription.queryTokenLimit;
      if(!userMaxTokens) {
        return true;
      }

      const tokenKey = this.getTokenKey(userId);
      const currentTokens = await this.getCurrentTokenCount(tokenKey);
  
      if (currentTokens === null) {
        await this.redisClient.set(tokenKey, userMaxTokens);
        await this.redisClient.expire(tokenKey, this.config.tokenExpireTime);
        return true;
      }
    
      if (currentTokens <= 0) {
        return false;
      }
      return true;
    }
    
    async decreToken(userId: number): Promise<void> {
      const tokenKey = this.getTokenKey(userId);
      await this.redisClient.decr(tokenKey);
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
      return `${this.config.tokenKeyPrefix}:${userId}`;
    }
  
    private async getCurrentTokenCount(tokenKey: string): Promise<number | null> {
      const value = await this.redisClient.get(tokenKey);
      return value === null ? null : parseInt(value, 10);
    }
  }
