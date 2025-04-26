import { BadRequestResponseError } from "@/shared/response/errors.response";
import { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      refreshToken?: string;
    }
  }
}

export const verifyRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken;
    
    if (!refreshToken) {
      throw new BadRequestResponseError('Refresh token required!')
    }
    
    req.refreshToken = refreshToken; 
    next();
};