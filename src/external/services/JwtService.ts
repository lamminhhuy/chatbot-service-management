
import * as jwt from 'jsonwebtoken';
import { IJwtService } from '@/modules/auth/interfaces/IJwtService';
import { User } from '@/shared/entites/User';

export class JwtService implements IJwtService {
  private accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'your-access-secret';
  private refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';

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
}