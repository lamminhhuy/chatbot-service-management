
import jwt from 'jsonwebtoken';
import { IJwtService } from '@/modules/auth/interfaces/IJwtService';
import { User } from '@/modules/user/models/UserModel';

export class JwtService implements IJwtService {
  private accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'mysecretToken123' ;
  private refreshTokenSecret = process.env.JWT_REFRESH_SECRET ||  'mysecretToken123' ;
  
  generateAccessToken(user: User): string {
    return jwt.sign(
      { userId: user.id, email: user.email },
      this.accessTokenSecret,
      { expiresIn: '15m' }
    );
  }

  generateRefreshToken(user: User): string {
    return jwt.sign(
      { userId: user.id },
      this.refreshTokenSecret,
      { expiresIn: '7d' }
    );
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.accessTokenSecret);
    } catch (error) {
      return jwt.verify(token, this.refreshTokenSecret);
    }
  }
  generateTokenPair(user: User): { accessToken: string; refreshToken: string } {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    return { accessToken, refreshToken };
  }
}