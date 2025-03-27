import { AppDataSource } from '@/database/PostgresDB';
import { JwtService } from '@/modules/auth/services/JwtService';
import { UserRepository } from '@/modules/user/repositories/UserRepository';
import { RoleRepository } from '@/modules/role/repositories/RoleRepository';
import { RoleService } from '@/modules/user/services/RoleService';
import { UserService } from '@/modules/user/services/UserService';
import { EmailService } from '@/shared/services/EmailService';
import { container } from 'tsyringe';
import { AuthService } from './services/AuthService';
import { AuthController } from './controllers/AuthController';
import { RedisOTPService } from '@/shared/services/RedisOTPService';

export function registerAuthDependencies() {
  container.register('IEmailService', { useClass: EmailService });
  container.register('IJwtService', { useClass: JwtService });
  container.register('IOTPService', { useClass: RedisOTPService });
  container.register(AuthService, { useClass: AuthService });
  container.register(AuthController, { useClass: AuthController });
}

export const authContainer = container