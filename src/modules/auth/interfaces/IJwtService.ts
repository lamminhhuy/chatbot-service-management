import { User } from "@/modules/user/models/UserModel";

export interface IJwtService {
    generateAccessToken(userId: number, email: string): string;
    generateRefreshToken(userId: number, email: string): string;
    verifyAccessToken(token: string): any;
    verifyRefreshToken(token: string): any;
    generateTokenPair(userId: number, email: string): { accessToken: string; refreshToken: string };
  }