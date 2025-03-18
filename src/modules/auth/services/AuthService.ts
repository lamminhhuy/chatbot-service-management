
import { IUserRepository } from '@/shared/interfaces/repositories/IUserRepository';
import { IAuthStrategy } from '../interfaces/IAuthStrategy';
import { IJwtService } from '../interfaces/IJwtService';
import { User } from '@/shared/entites/User';

export class AuthService {
  constructor(
    private authStrategy: IAuthStrategy,
    private jwtService: IJwtService,
    private userRepository: IUserRepository 
  ) {}

  async loginWithGoogle(code: string): Promise<{ accessToken: string; refreshToken: string }> {
    const googleUser = await this.authStrategy.authenticate(code);

    let user = await this.userRepository.findByGoogleId(googleUser.googleId);
    if (!user) {
      user = new User();
      user.googleId = googleUser.googleId;
      user.email = googleUser.email;
      user.avatarUrl = googleUser.avatarUrl;
      user.fullName = googleUser.email.split('@')[0];
      user.status = 'active';
      user.emailVerified = true;
      user = await this.userRepository.createUser(user);
    }

    const accessToken = this.jwtService.generateAccessToken(user);
    const refreshToken = this.jwtService.generateRefreshToken(user);

    user.jwtRefreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.userRepository.updateUser(user);

    await this.saveUserSession(user.id, accessToken, refreshToken);

    return { accessToken, refreshToken };
  }

  private async saveUserSession(userId: number, accessToken: string, refreshToken: string) {
  }
}