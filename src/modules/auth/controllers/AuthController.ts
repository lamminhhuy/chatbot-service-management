
import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { SuccessResponse } from '@/shared/response/success.response';
import { RegisterRequestDTO } from '../dtos/RegisterRequest.dto';
import { registerResponseDTO } from '../dtos/RegisterReponse.dto';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async requestOTP(req: Request, res: Response): Promise<void> {
      const { email } = req.body;
      await this.authService.requestOTP(email);
      new SuccessResponse({
        message: "OTP đã được gửi đến email của bạn"
      }).send(res);
  }

  async verifyOTP(req: Request<{},{},RegisterRequestDTO>, res: Response): Promise<void> {
      const { email, otp, username, password, phoneNumber } = req.body
      const user = await this.authService.verifyOTPAndRegister({ email, otp, username, password, phoneNumber });
      new SuccessResponse({
        message: "User registered successfully!",
        data: registerResponseDTO.parse(user)
      }).send(res);
}}