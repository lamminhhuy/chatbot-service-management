import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { SuccessResponse } from '@/shared/response/success.response';
import { RegisterRequestDTO } from '../dtos/RegisterRequest.dto';
import { inject, singleton } from 'tsyringe';
import { LoginReqDTO } from '../dtos/LoginRequest.dto';
import { env } from '@/configs/envConfig';
import { getCookieOptions } from '@/shared/utils/getCookieOptions';
import { LoginResDTOSchema } from '../dtos/LoginResponse.dto';
import { RegisterResponseDTOSchema } from '../dtos/RegisterReponse.dto';
import { UpdatePasswordDTO } from '@/modules/user/dtos/UpdateUser.dto';
import { RequestResetPasswordDTO, VerifyResetPasswordDTO } from '../dtos/ResetPassword.dto';

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
      message: 'OTP sent successfully!',
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
}
  async resetPassword(req: Request<{}, {}, RequestResetPasswordDTO>, res: Response): Promise<void> {
    const user = await this.authService.resetPassword(req.body);
    new SuccessResponse({
      message: 'OTP sent successfully!',
      data: { user },
    }).send(res);
  }
  async verifyResetPasswordOtp(req: Request<{}, {}, VerifyResetPasswordDTO>, res: Response): Promise<void> {
    const user = await this.authService.verifyResetPasswordOtp(req.body);
    new SuccessResponse({
      message: 'Password reset successfully!',
      data: { user },
    }).send(res);
  }
  async logout(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.cookies;
    await this.authService.logout(refreshToken);
    res.clearCookie('refreshToken');
    new SuccessResponse({
      message: 'User logged out successfully!',
    }).send(res);
  }
}