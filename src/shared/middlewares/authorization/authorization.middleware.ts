import { CustomRoute } from "@/modules/auth/interfaces/CustomRoute";
import { AuthorizationService } from "@/modules/authorization/services/AuthorziationService";
import { CustomRequest } from "@/shared/interfaces/CustomRequest";
import { BadRequestResponseError } from "@/shared/response/errors.response";
import { ModuleLoader } from "@/shared/utils/ModuleLoader";
import { PermissionFormatter } from "@/shared/utils/PermissionFormatter";
import { NextFunction } from "express";
import { container } from "tsyringe";

function getEndpointPath(url: string): string {
    return url.split('/api/v1')[1] || '';
}

function getFullPath(prefix: string, path: string): string {
    return `${prefix}${path === '/' ? '': path}`;
}

export const authorizationMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
const moduleLoader = ModuleLoader.getInstance();
const  modules = moduleLoader.getAllModules()
const routes = modules.flatMap(module => module.routes.map(route => ({...route, fullPath: getFullPath(module.prefix, route.path), 
 permissionCode: PermissionFormatter.formatPermissionCode(module.prefix,route.handler.controller,route.handler.action.name)})))
const matchRoute  = routes.find(route => route.fullPath === getEndpointPath(req.path) && route.method === req.method)
if(!matchRoute) return next(new Error("Route not found"));

const authorizationService =  container.resolve(AuthorizationService)
const isAllowed=  await authorizationService.checkPermission(req.user, matchRoute.permissionCode)
if (!isAllowed) {
    return next(new BadRequestResponseError("Unauthorized"));
}

next();
}