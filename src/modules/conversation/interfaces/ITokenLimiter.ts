export interface ITokenLimiter {
    checkToken(userId: number,userMaxTokens: number): Promise<boolean>;
    getRemainingTokens(userId: number, userMaxTokens: number): Promise<number>;
    resetToken(userId: number): Promise<void>;
    initializeUserToken(userId: number,userMaxTokens:number, tokenExpireTime: number): Promise<void>;
  }