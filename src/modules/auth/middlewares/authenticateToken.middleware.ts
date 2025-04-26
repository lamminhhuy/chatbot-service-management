import { NextFunction, Request, Response } from "express";
import { IJwtService } from "../interfaces/JwtService";
import { UserService } from "@/modules/user/services/UserService";
import { AuthFailureResponseError, BadRequestResponseError } from "@/shared/response/errors.response";
import { container, inject, injectable } from "tsyringe";
import { User } from "@/modules/user/models/UserModel";
import { CustomRequest } from "@/shared/interfaces/CustomRequest";
import TokenAuthenticator from "../services/TokenAuthenticator";


const tokenAuthenticator =  container.resolve(TokenAuthenticator);

export const authenticateTokenMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
      throw new AuthFailureResponseError('Access token is required');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AuthFailureResponseError('Access token is required');
    }

    req.user = await tokenAuthenticator.authenticateToken(token);
    next()
  } catch (error) {
    next(error);
  }
};
