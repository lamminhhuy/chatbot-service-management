export interface ICreateUserSession {
    userId: number;
    accessToken: string;
    refreshToken: string;
    deviceInfo?: string;
    ipAddress?: string;
}