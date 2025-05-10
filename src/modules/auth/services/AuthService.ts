
import { UserService } from '@/modules/user/services/UserService';
import { BadRequestResponseError, ErrorsResponse } from '@/shared/response/errors.response';
import { RegisterRequestDTO } from '../dtos/RegisterRequest.dto';
import { IJwtService } from '../interfaces/JwtService';
import { inject, injectable } from 'tsyringe';
import * as argon2 from "argon2";
import { LoginReqDTO } from '../dtos/LoginRequest.dto';
import UserSubscriptionService from '@/modules/subscription/services/UserSubscriptionService';
import { CreateUserDTO } from '@/modules/user/dtos/CreateUser.dto';
import { Transactional } from 'typeorm-transactional';
import { IOtpService } from '@/shared/services/otp/OtpService.type';
import { RequestResetPasswordDTO, VerifyResetPasswordDTO } from '../dtos/ResetPassword.dto';
import { UserResponseDTO, UserResponseDTOSchema } from '@/modules/user/dtos/UserResponse.dto';
import SubscriptionService from '@/modules/subscription/services/SubscriptionService';
import { SubscriptionCode } from '@/modules/subscription/enums/SubscriptionCode';
import { UserSession } from '@/modules/user/models/UserSessionModel';
import { IOAuth2Provider } from '../interfaces/IOAuth2Provider';

@injectable()
export class AuthService   {
  constructor(
              @inject('IOtpService') private otpService: IOtpService,
              @inject(UserService) private userService: UserService,
              @inject(SubscriptionService) private subscriptionService: SubscriptionService,
              @inject(UserSubscriptionService) private userSubscriptionService: UserSubscriptionService,
              @inject('IJwtService') private jwtService: IJwtService,
              @inject('IOAuth2Provider') private oauth2Client: IOAuth2Provider) {
    this.userService = userService;
    this.otpService = otpService;
    this.jwtService = jwtService;
    this.oauth2Client = oauth2Client;
  }
  @Transactional()
  async login({ email, password }: LoginReqDTO): Promise<{ user: UserResponseDTO; accessToken: string; refreshToken: string }
  > {
    const existingUser = await this.userService.findByEmail(email);
    if (!existingUser) {
      throw new BadRequestResponseError('User not found!');
    }
    const  isPasswordValid = await argon2.verify(existingUser.password, password);
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
        userId:existingUser.id
      });
    const sanitizedUser = UserResponseDTOSchema.parse({...existingUser,userSubscription})
    return {
        user: sanitizedUser,
        accessToken,
        refreshToken,
      };
}
  async requestOTP(email: string): Promise<void> {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestResponseError('Email already existed!');
    }
   
    await this.otpService.sendOtp(email);
  }
  
  async verifyOTP(email: string, otp: string): Promise<void> {
    await this.otpService.verifyOtp(email, otp);
  }


@Transactional()
  async verifyOTPAndRegister({
    email,
    otp,
    username,
    password,
    phoneNumber,
  }: RegisterRequestDTO): Promise<{ user: UserResponseDTO; accessToken: string; refreshToken: string }> {
    await this.verifyOTP(email, otp);
    const user = await this.userService.createUser({ email, username, password, phoneNumber });
    const { accessToken, refreshToken } = this.jwtService.generateTokenPair(user.id, user.email);
    await this.userService.createUserSession({
      accessToken,
      refreshToken,
      userId:user.id  
    });
     const subscription= await   this.subscriptionService.findByCode(SubscriptionCode.BASIC);
  
         if(!subscription){
        throw new ErrorsResponse("Basic subscription is not existed",500);
        }
    
        const userSubscription = await this.userSubscriptionService.create({
          userId: user.id,
          subscriptionId: subscription.id,
        });
  
     const sanitizedUser = UserResponseDTOSchema.parse({...user,userSubscription})
      return {
      user: sanitizedUser,
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
  async resetPassword (input: RequestResetPasswordDTO): Promise<void> {
    const user = await this.userService.findByEmail(input.email);
    if (!user) {
      throw new BadRequestResponseError('User not found!');
    }
    this.otpService.sendOtp(input.email);
  }

  async verifyResetPasswordOtp(input: VerifyResetPasswordDTO): Promise<void> {
    await this.otpService.verifyOtp(input.email, input.otp);
    
    const user = await this.userService.findByEmail(input.email);
    
    if (!user) {
      throw new BadRequestResponseError('User not found!')
    }
    
    await this.userService.resetPassword(user.id, input.newPassword);
  }

  async logout(refreshToken: string): Promise<void> {
    await this.validateRefreshToken(refreshToken);
    await this.userService.revokeToken(refreshToken);
  }

  private async validateRefreshToken(refreshToken: string): Promise<UserSession> {
    const userSession = await this.userService.findUserActiveRefreshToken(refreshToken);
    if (!userSession) {
      throw new BadRequestResponseError('Refresh token is not valid!');
    }
    return userSession;
  }
  @Transactional()
  async loginWithGoogle(token: string): Promise<{ user: UserResponseDTO; accessToken: string; refreshToken: string }> {
    const ticket = await this.oauth2Client.verifyIdToken(token);
    const payload = ticket.getPayload();
    if (!payload) {
      throw new BadRequestResponseError('Invalid token!');
    }
    let user = await this.userService.findByEmail(payload.email);

    if (!user) {
     user = await this.userService.createUserThroughGoogleLogin({
      email: payload.email,
      username: payload.given_name,
      password: payload.sub,
      phoneNumber: payload.phone_number
     }) 
    }
    const { accessToken, refreshToken } = this.jwtService.generateTokenPair(user.id, user.email);
    await this.userService.createUserSession({
      accessToken,
      refreshToken,
      userId:user.id
    });

    const sanitizedUser = UserResponseDTOSchema.parse(user)
    return {
      user: sanitizedUser,
      accessToken,
      refreshToken,
    };
  }   
}