import { Request, Router } from "express";
import { container } from "tsyringe";
import { UserController } from "../controllers/UserController";
import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";
import { validateRequest, validateRequestQueryParams } from "@/shared/middlewares/validateRequest/validateRequest";
import { UpdatePasswordDTOSchema, UpdateUserDTOSchema } from "../dtos/UpdateUser.dto";
import { CreateUserDTOSchema } from "../dtos/CreateUser.dto";
import { AssignRoleDTOSchema } from "../dtos/AssignRole.dto";
import { RemoveRoleDTOSchema } from "../dtos/RemoveRole.dto";
import { UserQueryParamsDTOSchema } from "../dtos/UserQueryParamss.dto";
import { requireAuthorization } from "@/shared/middlewares/authorization/authorization.middleware";
import { RoleCode } from "../enums/Role";

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
            method: 'PUT',
            path: '/:id',
            handler: { controller: 'user',
                action:  userController.updateUser.bind(userController)},
            middlewares: [validateRequest(UpdateUserDTOSchema), requireAuthorization([RoleCode.ADMIN])]
        },
        {
            method: "PUT",
            path: "/me/profile",
            handler: { controller: 'user',
                action:  userController.updateMe.bind(userController)},
            middlewares: [validateRequest(UpdateUserDTOSchema)]
        },
        {
            method: "PUT",
            path: '/:id/change-subscription',
            handler: { controller: 'user',
                action:  userController.changeSubscription.bind(userController)},
            middlewares: []
        },
        {
            method: "POST",
            path: "/",
            handler: { controller: 'user',
                action:  userController.create.bind(userController)},
            middlewares: [validateRequest(CreateUserDTOSchema), requireAuthorization([RoleCode.ADMIN])]
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
            middlewares: [ requireAuthorization([RoleCode.ADMIN]), validateRequest(AssignRoleDTOSchema)]
        },
        {
            method: "POST",
            path: "/revoke-role",
            handler: { controller: 'user',
                action:  userController.removeRole.bind(userController)},
            middlewares: [ requireAuthorization([RoleCode.ADMIN]), validateRequest(RemoveRoleDTOSchema)]
        },
        {
            method: 'GET',
            path: '/',
            handler: { controller: 'user',
                action:  userController.getAll.bind(userController)}
        },
        {
            method: 'DELETE',
            path: '/:id',
            handler: { controller: 'user',
                action:  userController.deleteUser.bind(userController)},
            middlewares: [ requireAuthorization([RoleCode.ADMIN])]
        },
        {
            method: 'GET',
            path: '/paginated',
            handler: { controller: 'user',
                action:  userController.getPaginatedUsers.bind(userController)},
            middlewares: [ requireAuthorization([RoleCode.ADMIN,RoleCode.MANAGER]), validateRequestQueryParams(UserQueryParamsDTOSchema)]
        }
    ]
}