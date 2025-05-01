import { RequestHandler, Router } from "express";
import { AsyncHandler } from "@/shared/utils/asyncHandler";
import { RequestMiddleware } from "@/modules/auth/interfaces/CustomRoute";
import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";

type Method = 'get' | 'post' | 'put' | 'delete' | 'patch' 

export class ModuleLoader {
    private readonly applicationPrefix = 'api';
    private readonly defaultApiVersion = 1;
    private static instance: ModuleLoader | null = null;

    constructor(
        private modules: ModuleConfig[],
        private globalMiddlewares: RequestMiddleware[],
        private asyncHandler: AsyncHandler
    ) {}

    public loadAllModules = (): Router => {
        const router = Router();

        this.modules.flatMap(module => {
            const modulePrefix = module.prefix;
            module.routes.forEach(route => {
                if (!route.isPublic) {
                    router[route.method.toLocaleLowerCase() as Method](
                        this.getRoutePath(route.apiVersion, modulePrefix, route.path),
                        [...this.globalMiddlewares, ...(route.middlewares || [])] as RequestHandler[],
                        this.asyncHandler(route.handler.action) as RequestHandler
                    );
                } else {
                    router[route.method.toLocaleLowerCase() as Method](
                        this.getRoutePath(route.apiVersion, modulePrefix, route.path),
                        [...(route.middlewares || [])] as RequestHandler[],
                        this.asyncHandler(route.handler.action) as RequestHandler
                    );
                }
            });
        });
        return router;
    }

    private getRoutePath(
        apiVersion: number = this.defaultApiVersion,
        modulePrefix: string,
        path: string
    ): string {
        return `/${this.applicationPrefix}/v${apiVersion}${modulePrefix}${path}`;
    }

    public getAllModules = () => {
        return this.modules;
    }

    public getAllRoutes = () => {
        return this.modules.flatMap(module => module.routes);
    }

    static getInstance(
        modules?: ModuleConfig[],
        globalMiddlewares?: RequestMiddleware[],
        asyncHandler?: AsyncHandler
    ): ModuleLoader {
        if (!ModuleLoader.instance && modules && globalMiddlewares && asyncHandler) {
            ModuleLoader.instance = new ModuleLoader(modules, globalMiddlewares, asyncHandler);
        }
        if (!ModuleLoader.instance) {
            throw new Error('ModuleLoader not initialized. Please provide required parameters.');
        }
        return ModuleLoader.instance;
    }
}