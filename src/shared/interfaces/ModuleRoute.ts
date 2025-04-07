import { Router } from "express";

export interface ModuleRoute {
    prefix: string;
    router: Router;
}