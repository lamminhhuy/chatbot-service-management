
import jwt from 'jsonwebtoken';
import { IJwtService } from '@/modules/auth/interfaces/JwtService';
import { AuthFailureResponseError } from '@/shared/response/errors.response';
import { env } from '@/shared/infrastructure/configs/envConfig';

export class JwtService implements IJwtService {
  private accessTokenSecret = env.JWT_ACCESS_SECRET  ;
  private refreshTokenSecret = env.JWT_REFRESH_SECRET  ;
  
  generateAccessToken(userId: number, email: string): string {
    if (!userId || !email) throw new AuthFailureResponseError('Invalid user data!');
    
    return jwt.sign(
      { userId, email },
      this.accessTokenSecret,
      { expiresIn: env.JWT_ACCESS_TOKEN_EXPIRATION_TIME as number || '15m' }
    );
  }

  generateRefreshToken(userId: number): string {
    if (!userId) throw new AuthFailureResponseError('Invalid user data!');

    return jwt.sign(
      { userId },
      this.refreshTokenSecret,  
      { expiresIn: '7d' }
    );
  }

  verifyAccessToken(token: string): any {
    try {
      return jwt.verify(token, this.accessTokenSecret);
    } catch (error) {
      throw new AuthFailureResponseError('Access token is not valid!');
    }
  }
  verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, this.refreshTokenSecret);
    } catch (error) {
      throw new AuthFailureResponseError('Refresh token is not valid!');
    }

  }
  generateTokenPair(userId: number, email: string): { accessToken: string; refreshToken: string } {
    const accessToken = this.generateAccessToken(userId,email);
    const refreshToken = this.generateRefreshToken(userId);
    return { accessToken, refreshToken };
  }
}