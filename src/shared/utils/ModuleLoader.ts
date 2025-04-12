import { RequestHandler, Router } from "express"
import { AsyncHandler } from "@/shared/utils/asyncHandler";
import { RequestMiddleware } from "@/modules/auth/interfaces/CustomRoute";
import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";


export class ModuleLoader {
    private readonly applicationPrefix = 'api';
    private readonly defaultApiVersion = 1;
    
    constructor(private modules: ModuleConfig[], private globalMiddlewares: RequestMiddleware[], private asyncHandler: AsyncHandler) {
    }

    public loadAllModules = (): Router => {
    const router= Router();

    this.modules.flatMap(module => {
       const modulePrefix = module.prefix
        module.routes.forEach(route => {
            if(!route.isPublic)
            {
            router[route.method](this.getRoutePath(route.apiVersion, modulePrefix, route.path), [...this.globalMiddlewares, ...route.middlewares || []] as RequestHandler[], this.asyncHandler(route.handler) as RequestHandler)
            }
            else{
            router[route.method](this.getRoutePath(route.apiVersion, modulePrefix, route.path), [...route.middlewares || []] as RequestHandler[], this.asyncHandler(route.handler) as RequestHandler)
            }
        })
    }) 
    return router;
}

private getRoutePath (
    apiVersion: number = this.defaultApiVersion,
    modulePrefix: string,
    path: string,
): string {
    return `/${this.applicationPrefix}/v${apiVersion}${modulePrefix}${path}`;
}
    
public getAllModules = () => {
        return this.modules;
    }   
}

    
 
