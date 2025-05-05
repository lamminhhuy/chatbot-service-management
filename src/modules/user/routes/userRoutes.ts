import { Request, Router } from "express";
import { container } from "tsyringe";
import { UserController } from "../controllers/UserController";
import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";
import { validateRequest } from "@/shared/middlewares/validateRequest/validateRequest";
import { UpdatePasswordDTOSchema, UpdateUserDTOSchema } from "../dtos/UpdateUser.dto";
import { CreateUserDTOSchema } from "../dtos/CreateUser.dto";
import { AssignRoleDTOSchema } from "../dtos/AssignRole.dto";
import { RemoveRoleDTOSchema } from "../dtos/RemoveRole.dto";

export const userRouter = Router()

const userController = container.resolve(UserController)

export const userModule: ModuleConfig = {
    prefix: "/users",
    moduleName: 'user',
    routes:[
        {
            method: "GET",
            path: "/me/profile",
            handler: { controller: 'user',
                action:  userController.getProfile.bind(userController)},
            middlewares: []
        },
        {
            method: "PUT",
            path: "/me",
            handler: { controller: 'user',
                action:  userController.update.bind(userController)},
            middlewares: [validateRequest(UpdateUserDTOSchema)]
        },
        {
            method: "POST",
            path: "/",
            handler: { controller: 'user',
                action:  userController.create.bind(userController)},
            middlewares: [validateRequest(CreateUserDTOSchema)]
        },
        {
            method: "POST",
            path: "/me/update-password",
            handler: { controller: 'user',
                action:  userController.updatePassword.bind(userController)},
            middlewares: [validateRequest(UpdatePasswordDTOSchema)]
        },
        {
            method: "POST",
            path: "/assign-role",
            handler: { controller: 'user',
                action:  userController.assignRole.bind(userController)},
            middlewares: [validateRequest(AssignRoleDTOSchema)]
        },
        {
            method: "POST",
            path: "/remove-role",
            handler: { controller: 'user',
                action:  userController.removeRole.bind(userController)},
            middlewares: [validateRequest(RemoveRoleDTOSchema)]
        },
        {
            method: "POST",
            path: "/",
            handler: { controller: 'user',
                action:  userController.create.bind(userController)},
            middlewares: [validateRequest(CreateUserDTOSchema)]
        },
        {
            method: 'GET',
            path: '/',
            handler: { controller: 'user',
                action:  userController.getAll.bind(userController)}
        }
      
    ]
}