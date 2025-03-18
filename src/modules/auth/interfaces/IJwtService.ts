import { User } from "@/shared/entites/User";

export interface IJwtService {
    generateAccessToken(user: User): string;
    generateRefreshToken(user: User): string;
    verifyToken(token: string): any;
  }