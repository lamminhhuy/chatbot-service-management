import { CustomRequest } from "@/shared/interfaces/CustomRequest";
import { NextFunction, Response } from "express";

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

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
    handler: {
        controller: string;
        action: RequestHandler;
    };
    middlewares?: RequestMiddleware[];
}