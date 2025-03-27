import { User } from "@/modules/user/models/UserModel";

export interface IJwtService {
    generateAccessToken(user: User): string;
    generateRefreshToken(user: User): string;
    verifyToken(token: string): any;
    generateTokenPair(user: User): { accessToken: string; refreshToken: string };
  }