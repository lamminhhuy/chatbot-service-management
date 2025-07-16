import { env } from "@/shared/infrastructure/configs/envConfig";
import { IOAuth2Provider } from "@/modules/auth/interfaces/IOAuth2Provider";
import { OAuth2Client } from "google-auth-library";
import { injectable } from "tsyringe";

@injectable()
export class OAuth2Provider implements IOAuth2Provider {
    private client: OAuth2Client;
    constructor(){
        this.client = new OAuth2Client();
    }
    verifyIdToken(token: string): Promise<any> {
        return this.client.verifyIdToken({
            idToken: token,
            audience: env.GOOGLE_CLIENT_ID
        });
    }
}
