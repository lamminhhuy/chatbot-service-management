import { NextFunction, Request, Response } from "express";
import { IJwtService } from "../interfaces/IJwtService";
import { UserService } from "@/modules/user/services/UserService";
import { AuthFailureResponseError, BadRequestResponseError } from "@/shared/response/errors.response";
import { container, inject, injectable } from "tsyringe";

@injectable()
class TokenAuthenticator {
    constructor( @inject('IJwtService') private jwtService: IJwtService, @inject(UserService) private userService: UserService) {
    }
    public async authenticateToken (accessToken: string) {

        if (accessToken == null)    throw new AuthFailureResponseError();
        this.jwtService.verifyToken(accessToken);
        const userSession = await this.userService.findUserActiveAccessToken(accessToken);
        if(!userSession)
        {
        throw new AuthFailureResponseError()
        }
}
}

const tokenAuthenticator =  container.resolve(TokenAuthenticator);

export const authenticateTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
      throw new BadRequestResponseError('Access token is required');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new BadRequestResponseError('Access token is required');
    }

    await tokenAuthenticator.authenticateToken(token);
    next()
  } catch (error) {
    next(error);
  }
};
