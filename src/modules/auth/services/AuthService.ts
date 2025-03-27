
import { UserService } from '@/modules/user/services/UserService';
import { IEmailService } from '@/shared/interfaces/services/IEmailService';
import { BadRequestResponseError } from '@/shared/response/errors.response';
import { generateOTP } from '@/shared/utils/generateOTP';
import { RegisterRequestDTO } from '../dtos/RegisterRequest.dto';
import { User } from '@/modules/user/models/UserModel';
import { IJwtService } from '../interfaces/IJwtService';
import { ICreateUser } from '@/modules/user/interfaces/ICreateUser';
import { RegisterResponseDTO } from '../dtos/RegisterReponse.dto';
import { inject, injectable } from 'tsyringe';
import { IOTPService } from '@/shared/services/RedisOTPService';
import { LoginResponseDTO } from '../dtos/LoginResponse.dto';
import bcrypt from 'bcrypt';
import { LoginReqDTO } from '../dtos/LoginRequest.dto';

@injectable()
export class AuthService   {
  constructor(@inject('IEmailService') private emailService: IEmailService,
              @inject('IOTPService') private otpStorage: IOTPService,
              @inject(UserService) private userService: UserService,
              @inject('IJwtService') private jwtService: IJwtService) {
    this.userService = userService;
    this.emailService = emailService;
    this.otpStorage = otpStorage;
    this.jwtService = jwtService
  }

  async login({ email, password }: LoginReqDTO): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const existingUser = await this.userService.findByEmail(email);
    if (!existingUser) {
      throw new BadRequestResponseError('User not found!');
    }
    const  isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
        throw new BadRequestResponseError('Invalid password!');
    }
      
    const accessToken = this.jwtService.generateAccessToken(existingUser);
    const refreshToken = this.jwtService.generateRefreshToken(existingUser);
    await this.userService.createUserSession({
        accessToken,
        refreshToken,
        userId: existingUser.id,
      });
      return {
        user: existingUser,
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
    await this.otpStorage.setOTP(email, otp, 1000000);
    await this.emailService.sendOTP(email, otp);
    
  }

  async verifyOTP(email: string, otp: string): Promise<void> {
    const storedOTP = await this.otpStorage.getOTP(email);
    if (!storedOTP || storedOTP !== otp) {
      throw new BadRequestResponseError('OTP is not valid or expired!');
    }
    await this.otpStorage.deleteOTP(email);
  }

  async registerUser(data: ICreateUser): Promise<User> {
    const user = await this.userService.createUser(data);
    return user;
  }

  async verifyOTPAndRegister({
    email,
    otp,
    username,
    password,
    phoneNumber,
  }: RegisterRequestDTO): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    await this.verifyOTP(email, otp);
    const user = await this.registerUser({ email, username, password, phoneNumber });
    const { accessToken, refreshToken } = this.jwtService.generateTokenPair(user);
    await this.userService.createUserSession({
      accessToken,
      refreshToken,
      userId: user.id,
    });
  
    return {
      user,
      accessToken,
      refreshToken,
    };
  }
  async handleRefreshToken (refreshToken: string): Promise<{accessToken: string, refreshToken: string }> {
    const { userId } = await this.jwtService.verifyToken(refreshToken);
    const userSession = await this.userService.findUserActiveRefreshToken(refreshToken);

    if (userSession?.refreshToken !== refreshToken || userSession.userId !== userId) {
      throw new BadRequestResponseError('Refresh token is not valid!');
    }
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = this.jwtService.generateTokenPair(userSession.user);

    await this.userService.handleUpdateAccessToken(newAccessToken, userId);
    await this.userService.handleUpdateRefreshToken(newRefreshToken, userId);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

}