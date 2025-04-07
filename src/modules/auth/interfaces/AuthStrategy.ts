export interface IAuthStrategy {
    authenticate(token: string): Promise<any>;
    generateAuthUrl(): string;
  }