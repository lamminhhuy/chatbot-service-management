import { container } from "tsyringe";
import { ITokenLimiter } from "../interfaces/ITokenLimiter";
import { BadRequestResponseError } from "@/shared/response/errors.response";
import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "@/shared/interfaces/CustomRequest";

export const validateQueryToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const queryTokenLimiter = container.resolve<ITokenLimiter>('ITokenLimiter');
try{
  const allowed = await queryTokenLimiter.checkToken(req.user.id); 
  if (!allowed) {
    throw new BadRequestResponseError("You are running out of tokens");
  }
  next();
} catch (error) {
  next(error);
}}
