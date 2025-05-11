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

export function validateRequestQueryParams<T extends ZodSchema>(schema: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
    if(req.query.offset && req.query.page){
        return next(new BadRequestResponseError("Cannot provide both 'page' and 'offset' parameters simultaneously"));
    }
    const parsedQuery = schema.parse(req.query);

    if(parsedQuery.page){
        parsedQuery.offset = Number(parsedQuery.page -1 ) * Number(parsedQuery.limit);
    }
    
    req.query = parsedQuery;
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

export function validateRequestParams<T extends ZodSchema>(schema: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.params);
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