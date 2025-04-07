import { CustomRequest } from "@/shared/interfaces/CustomRequest";
import { NextFunction, Response, RequestHandler as ExpressRequestHandler } from "express";

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export type RequestHandler = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => Promise<void>;

export type RequestMiddleware = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => Promise<void> | void;
 
export interface CustomRoute {
    method: HttpMethod;
    isPublic?: boolean;
    apiVersion?: number; 
    path: string;
    handler: RequestHandler;
    middlewares?: RequestMiddleware[];
}