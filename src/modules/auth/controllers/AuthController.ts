import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { SuccessResponse } from '@/shared/response/success.response';
import { BadRequestResponseError } from '@/shared/response/errors.response';
import { RegisterRequestDTO, RegisterRequestDTOSchema } from '../dtos/RegisterRequest.dto';
import { inject, injectable, singleton } from 'tsyringe';
import { LoginReqDTO } from '../dtos/LoginRequest.dto';
import { env } from '@/configs/envConfig';
import { RegisterResponseDTOSchema } from '../dtos/RegisterReponse.dto';
import { UserResponseDTOSchema } from '@/modules/user/dtos/UserResponse.dto';
import { LoginResDTOSchema } from '../dtos/LoginResponse.dto';
import { getCookieOptions } from '@/shared/utils/getCookieOptions';

@singleton()
export class AuthController {
  constructor(@inject(AuthService) private authService: AuthService) {}

  async login(req: Request<{},{},LoginReqDTO>, res: Response): Promise<void> {
    const loginResult = await this.authService.login(req.body);
    const { user, accessToken, refreshToken } = loginResult;
    res.cookie('refreshToken', refreshToken, getCookieOptions(env.REFRESH_TOKEN_MAX_AGE));

    new SuccessResponse({
      message: 'User logged in successfully!',
      data: LoginResDTOSchema.parse({ user, accessToken }),
    }).send(res);
  }
  async requestOTP(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    await this.authService.requestOTP(email);

    new SuccessResponse({
      message: 'OTP đã được gửi đến email của bạn',
    }).send(res);
  }

  async verifyOTP(req: Request<{}, {}, RegisterRequestDTO>, res: Response): Promise<void> {
    const { user, accessToken, refreshToken } = await this.authService.verifyOTPAndRegister( req.body);
    res.cookie('refreshToken', refreshToken,getCookieOptions(env.REFRESH_TOKEN_MAX_AGE));

    new SuccessResponse({
      message: 'User registered successfully!',
      data: RegisterResponseDTOSchema.parse({ user, accessToken }),
    }).send(res);
  }

  async handleRefreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.cookies;
    const {accessToken, refreshToken: newRefreshToken} = await this.authService.handleRefreshToken(refreshToken);
    res.cookie('refreshToken', newRefreshToken, getCookieOptions(env.REFRESH_TOKEN_MAX_AGE));

    new SuccessResponse({
      message: 'Access token refreshed successfully! ',
      data: { accessToken },
    }).send(res);
}}