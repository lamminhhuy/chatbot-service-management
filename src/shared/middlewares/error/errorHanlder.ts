import { ErrorsResponse } from "@/shared/response/errors.response";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: ErrorsResponse,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;

  const errorResponse = {
    success: false,
    statusCode,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV !== "prod" && { stack: err.stack }),
  };
  console.error("Error detail:", err);
  res.status(statusCode).json(errorResponse);
};
