import { CustomRoute } from "./CustomRoute";


export interface ModuleConfig {
    prefix: string;
    moduleName: string;
    routes: CustomRoute[];
    
}