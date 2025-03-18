import { Role } from "../enums/Role";

export class User {
    id: number;
    email: string;
    fullName: string;
    password: string;
    googleId: string;
    avatarUrl: string;
    status: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date;
    jwtRefreshTokenExpiresAt: Date;
}
