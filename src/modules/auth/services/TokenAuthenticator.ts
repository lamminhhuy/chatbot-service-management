import { inject, injectable } from "tsyringe";
import { IJwtService } from "../interfaces/JwtService";
import { UserService } from "@/modules/user/services/UserService";
import { User } from "@/modules/user/models/UserModel";
import { AuthFailureResponseError } from "@/shared/response/errors.response";

@injectable()

class TokenAuthenticator {
    constructor( @inject('IJwtService') private jwtService: IJwtService, @inject(UserService) private userService: UserService) {
    }
    public async authenticateToken (accessToken: string): Promise<User> {

        if (accessToken == null)    throw new AuthFailureResponseError();
        this.jwtService.verifyAccessToken(accessToken);
        const userSession = await this.userService.findUserActiveAccessToken(accessToken);
        if(!userSession)
        {
        throw new AuthFailureResponseError()
        }
        return userSession.user;
}
}

export default TokenAuthenticator