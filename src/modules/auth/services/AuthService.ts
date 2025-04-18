
import { UserService } from '@/modules/user/services/UserService';
import { IEmailService } from '@/infrastructure/email/interfaces/IEmailService';
import { BadRequestResponseError, ErrorsResponse } from '@/shared/response/errors.response';
import { generateOTP } from '@/shared/utils/generateOTP';
import { RegisterRequestDTO } from '../dtos/RegisterRequest.dto';
import { User } from '@/modules/user/models/UserModel';
import { IJwtService } from '../interfaces/JwtService';
import { inject, injectable } from 'tsyringe';
import { IOTPService } from '@/infrastructure/otp/RedisOTPService';
import * as argon2 from "argon2";
import { LoginReqDTO } from '../dtos/LoginRequest.dto';
import UserSubscriptionService from '@/modules/subscription/services/UserSubscriptionService';
import { UserSubscription } from '@/modules/subscription/models/UserSubscription';
import { CreateUserDTO } from '@/modules/user/dtos/CreateUser.dto';
import { env } from '@/configs/envConfig';

@injectable()
export class AuthService   {
  constructor(@inject('IEmailService') private emailService: IEmailService,
              @inject('IOTPService') private otpStorage: IOTPService,
              @inject(UserService) private userService: UserService,
              @inject(UserSubscriptionService) private userSubscriptionService: UserSubscriptionService,
              @inject('IJwtService') private jwtService: IJwtService) {
    this.userService = userService;
    this.emailService = emailService;
    this.otpStorage = otpStorage;
    this.jwtService = jwtService
  }

  async login({ email, password }: LoginReqDTO): Promise<{ user: User &{userSubscription: UserSubscription}; accessToken: string; refreshToken: string }> {
    const existingUser = await this.userService.findByEmail(email);
    if (!existingUser) {
      throw new BadRequestResponseError('User not found!');
    }
    const  isPasswordValid = await argon2.verify(password, existingUser.password);
    if (!isPasswordValid) {
        throw new BadRequestResponseError('Invalid password!');
    }
   const userSubscription = await this.userSubscriptionService.getActiveUserSubsription(existingUser.id);
   if(!userSubscription) {
      throw new ErrorsResponse('User subscription not found!',408);
    }
    const accessToken = this.jwtService.generateAccessToken(existingUser.id,existingUser.email);
    const refreshToken = this.jwtService.generateRefreshToken(existingUser.id,existingUser.email);
    await this.userService.createUserSession({
        accessToken,
        refreshToken,
        user:existingUser
      });
    return {
        user: {...existingUser, userSubscription},
        accessToken,
        refreshToken,
      };
}
  async requestOTP(email: string): Promise<void> {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestResponseError('Email already existed!');
    }
    const otp = generateOTP();
    await this.otpStorage.setOTP(email, otp, env.OTP_EXPIRATION_TIME);
    await this.emailService.sendOTP(email, otp);
    
  }

  async verifyOTP(email: string, otp: string): Promise<void> {
    const storedOTP = await this.otpStorage.getOTP(email);
    if (!storedOTP || storedOTP !== otp) {
      throw new BadRequestResponseError('OTP is not valid or expired!');
    }
    await this.otpStorage.deleteOTP(email);
  }

  async registerUser(data: CreateUserDTO): Promise<User &{userSubscription: UserSubscription}> {
    const user = await this.userService.createUser(data);
    const userSubscription = await this.userSubscriptionService.getActiveUserSubsription(user.id);
    if(!userSubscription) {
       throw new ErrorsResponse('User subscription not found!',408);
     }
    return {...user,userSubscription};
  }

  async verifyOTPAndRegister({
    email,
    otp,
    username,
    password,
    phoneNumber,
  }: RegisterRequestDTO): Promise<{ user: User &{userSubscription: UserSubscription}; accessToken: string; refreshToken: string }> {
    await this.verifyOTP(email, otp);
    const user = await this.registerUser({ email, username, password, phoneNumber });
    const { accessToken, refreshToken } = this.jwtService.generateTokenPair(user.id, user.email);
    await this.userService.createUserSession({
      accessToken,
      refreshToken,
      user
    });
  
    return {
      user,
      accessToken,
      refreshToken,
    };
  }
  async handleRefreshToken (refreshToken: string): Promise<{accessToken: string, refreshToken: string }> {
    const { userId } = await this.jwtService.verifyRefreshToken(refreshToken);

    const userSession = await this.userService.findUserActiveRefreshToken(refreshToken);

    if (userSession?.refreshToken !== refreshToken || userSession.user.id !== userId) {
      throw new BadRequestResponseError('Refresh token is not valid!');
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = this.jwtService.generateTokenPair(userSession.user.id, userSession.user.email);

    await this.userService.handleUpdateTokens(newAccessToken, newRefreshToken, refreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

}