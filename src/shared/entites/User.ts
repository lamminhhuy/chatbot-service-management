export class User {
    id: number;
    email: string;
    username: string;
    password: string;
    googleId: string;
    avatarUrl: string;
    status: string;
    emailVerified: boolean;
    createdAt: Date;
    phoneNumber:string;
    updatedAt: Date;
    lastLoginAt: Date;
    jwtRefreshTokenExpiresAt: Date;
}
