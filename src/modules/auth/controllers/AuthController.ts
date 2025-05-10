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
import { RequestResetPasswordDTO, VerifyResetPasswordDTO } from '../dtos/ResetPassword.dto';
import { LoginGoogleDTO } from '../dtos/LoginGoogle.dto';

const getRefreshTokenCookieName = (origin: string | undefined): string => {
  if (!origin) {
    return 'refreshToken'; 
  }
  try {
    const url = new URL(origin);
    return `refreshToken_${url.hostname.replace(/\./g, '_')}`;
  } catch {
    return 'refreshToken';
  }
};

@singleton()
export class AuthController {
  constructor(@inject(AuthService) private authService: AuthService) {}

  async login(req: Request<{}, {}, LoginReqDTO>, res: Response): Promise<void> {
    const loginResult = await this.authService.login(req.body);
    const { user, accessToken, refreshToken } = loginResult;
    const cookieName = getRefreshTokenCookieName(req.get('origin'));
    res.cookie(cookieName, refreshToken, getCookieOptions(env.REFRESH_TOKEN_MAX_AGE));

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
    const { user, accessToken, refreshToken } = await this.authService.verifyOTPAndRegister(req.body);
    const cookieName = getRefreshTokenCookieName(req.get('origin'));
    res.cookie(cookieName, refreshToken, getCookieOptions(env.REFRESH_TOKEN_MAX_AGE));

    new SuccessResponse({
      message: 'User registered successfully!',
      data: RegisterResponseDTOSchema.parse({ user, accessToken }),
    }).send(res);
  }

  async handleRefreshToken(req: Request, res: Response): Promise<void> {
    const cookieName = getRefreshTokenCookieName(req.get('origin'));
    const refreshToken = req.cookies[cookieName];
    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }
    const { accessToken, refreshToken: newRefreshToken } = await this.authService.handleRefreshToken(refreshToken);
    res.cookie(cookieName, newRefreshToken, getCookieOptions(env.REFRESH_TOKEN_MAX_AGE));

    new SuccessResponse({
      message: 'Access token refreshed successfully!',
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
    const cookieName = getRefreshTokenCookieName(req.get('origin'));
    const refreshToken = req.cookies[cookieName];
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }
    res.clearCookie(cookieName);
    new SuccessResponse({
      message: 'User logged out successfully!',
    }).send(res);
  }

  async loginWithGoogle(req: Request<{}, {}, LoginGoogleDTO>, res: Response): Promise<void> {
    const loginResult = await this.authService.loginWithGoogle(req.body.token);
    const { user, accessToken, refreshToken } = loginResult;
    const cookieName = getRefreshTokenCookieName(req.get('origin'));
    res.cookie(cookieName, refreshToken, getCookieOptions(env.REFRESH_TOKEN_MAX_AGE));

    new SuccessResponse({
      message: 'User logged in successfully!',
      data: LoginResDTOSchema.parse({ user, accessToken }),
    }).send(res);
  }
}