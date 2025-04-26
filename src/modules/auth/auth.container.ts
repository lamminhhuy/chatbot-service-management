import { JwtService } from '@/modules/auth/services/JwtService';
import { container } from 'tsyringe';
import { AuthService } from './services/AuthService';
import { AuthController } from './controllers/AuthController';
import { RedisOTPService } from '@/infrastructure/otp/RedisOTPService';
import { EmailService } from '@/infrastructure/email/EmailService';
import TokenAuthenticator from './services/TokenAuthenticator';

export function registerAuthDependencies() {
  container.register('IEmailService', { useClass: EmailService });
  container.register('IJwtService', { useClass: JwtService });
  container.register('IOTPService', { useClass: RedisOTPService });
  container.register(AuthService, { useClass: AuthService });
  container.register(AuthController, { useClass: AuthController });
  container.register(TokenAuthenticator, { useClass: TokenAuthenticator });
}

export const authContainer = container