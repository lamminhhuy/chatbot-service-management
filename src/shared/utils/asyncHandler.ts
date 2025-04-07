import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../interfaces/CustomRequest";

type AsyncRouteHandler<T extends CustomRequest> = (
  req: T,
  res: Response,
  next: NextFunction
) => Promise<void>;

export type AsyncHandler = <T extends Request>(
  fn: AsyncRouteHandler<T>
) => ((req: T, res: Response, next: NextFunction) => void) 
export const asyncHandler: AsyncHandler = <T extends Request>(
  fn: AsyncRouteHandler<T>
): ((req: T, res: Response, next: NextFunction) => void) => {
  return (req: T, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
