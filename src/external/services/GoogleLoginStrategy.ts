
import { IAuthStrategy } from '@/modules/auth/interfaces/AuthStrategy';
import { google } from 'googleapis';

export class GoogleLoginStrategy implements IAuthStrategy {
  private oauth2Client: any;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  generateAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      scope: ['profile', 'email'],
      access_type: 'offline'
    });
  }

  async authenticate(code: string): Promise<any> {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: this.oauth2Client,
      version: 'v2'
    });

    const { data } = await oauth2.userinfo.get();
    return {
      googleId: data.id,
      email: data.email,
      avatarUrl: data.picture,
      name: data.name,
      tokens
    };
  }
}