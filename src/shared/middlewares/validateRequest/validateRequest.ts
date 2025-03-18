import { NextFunction, Request, Response } from "express";
import { z, ZodSchema } from "zod";
import { BadRequestResponseError } from "@/shared/response/errors.response";

export function validateRequest<T extends ZodSchema>(schema: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(
          (err) => `${err.path.join(".")}: ${err.message}`
        );
        return next(new BadRequestResponseError(errorMessages.join("; ")));
      }
      next(error);
    }
  };
}
