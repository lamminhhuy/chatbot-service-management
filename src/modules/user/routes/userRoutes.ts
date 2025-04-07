import { Request, Router } from "express";
import { container } from "tsyringe";
import { UserController } from "../controllers/UserController";
import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";

export const userRouter = Router()

const userController = container.resolve(UserController)

export const userModule: ModuleConfig = {
    prefix: "/user",
    routes:[
        {
            method: "get",
            path: "/profile/:id",
            handler: userController.getProfile.bind(userController),
            middlewares: []
        }
    ]
}