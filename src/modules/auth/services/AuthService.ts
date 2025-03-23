
import { UserService } from '@/modules/user/services/UserService';
import { IEmailService } from '@/shared/interfaces/services/IEmailService';
import { BadRequestResponseError } from '@/shared/response/errors.response';
import { IOTPStorage } from '@/shared/services/RedisOTPStorage';
import { generateOTP } from '@/shared/utils/generateOTP';
import { RegisterRequestDTO } from '../dtos/RegisterRequest.dto';
import { User } from '@/modules/user/models/UserModel';
import { CreateUserDto } from '@/shared/dtos/User';



export class AuthService   {
  private userService: UserService;
  private emailService: IEmailService;
  private otpStorage: IOTPStorage;

  constructor(emailService: IEmailService, otpStorage: IOTPStorage,userService: UserService) {
    this.userService = userService;
    this.emailService = emailService;
    this.otpStorage = otpStorage;
  }

  async requestOTP(email: string): Promise<void> {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestResponseError('Email already existed!');
    }
    const otp = generateOTP();
    await this.otpStorage.setOTP(email, otp, 10000);
    await this.emailService.sendOTP(email, otp);
    
  }

  async verifyOTP(email: string, otp: string): Promise<void> {
    const storedOTP = await this.otpStorage.getOTP(email);
    if (!storedOTP || storedOTP !== otp) {
      throw new BadRequestResponseError('OTP is not valid or expired!');
    }
    // await this.otpStorage.deleteOTP(email);
  }

  async registerUser(data: CreateUserDto): Promise<User> {
    const user = await this.userService.createUser(data);
    return user;
  }

  async verifyOTPAndRegister(
  {email, otp,username,password,phoneNumber}: RegisterRequestDTO
  ): Promise<User> {
    await this.verifyOTP(email, otp);
    return this.registerUser({email,username,password,phoneNumber});
  }
}