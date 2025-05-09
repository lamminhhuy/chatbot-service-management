
import { inject, injectable } from "tsyringe";
import { UserService } from "../services/UserService";
import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "@/shared/response/success.response";
import { UserResponseDTOSchema, UserResponseDTOSchemaArray } from "../dtos/UserResponse.dto";
import { CustomRequest } from "@/shared/interfaces/CustomRequest";
import { CreateUserDTO, CreateUserResponseSchema } from "../dtos/CreateUser.dto";
import { UpdatePasswordDTO, UpdateUserDTO, UpdateUserResponseDTOSchema } from "../dtos/UpdateUser.dto";
import { AssignRoleDTO } from "../dtos/AssignRole.dto";
import { RemoveRoleDTO } from "../dtos/RemoveRole.dto";
import { UserQueryParamsDTO } from "../dtos/UserQueryParamss.dto";

@injectable()
export class UserController {
    constructor(@inject(UserService) private userService: UserService) {
    }
    async getProfile(req: CustomRequest<{ id: number }, {}, {}>, res: Response, next: NextFunction): Promise<void> {
    
     const result =   await this.userService.getProfile(req.user.id);
            
     new SuccessResponse(
        { data: UserResponseDTOSchema.parse(result) }
     ).send(res)
    }
    async create(req: CustomRequest<{},{},CreateUserDTO>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.userService.createUser(req.body);
        new SuccessResponse({ data: CreateUserResponseSchema.parse(result) }).send(res);
    }

    async updateMe(req: CustomRequest<{},{},UpdateUserDTO>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.userService.updateMe(req.user.id, req.body);
        new SuccessResponse({ data: UpdateUserResponseDTOSchema.parse(result) }).send(res);
      }
    async updatePassword(req: CustomRequest<{},UpdatePasswordDTO>, res: Response, next: NextFunction): Promise<void> {
        await this.userService.updatePassword(req.user.id, req.body);
        new SuccessResponse({ data: null}).send(res);
      }

      async assignRole(req: CustomRequest<{},{},AssignRoleDTO>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.userService.assignRole(req.body);
        new SuccessResponse({ data: UpdateUserResponseDTOSchema.parse(result) }).send(res);
      }

      async removeRole(req: CustomRequest<{},{},RemoveRoleDTO>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.userService.removeRole(req.body);
        new SuccessResponse({ data: UpdateUserResponseDTOSchema.parse(result) }).send(res);
      }
      async getAll(req: CustomRequest<{},{},{}>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.userService.getAll();
        new SuccessResponse({ data: UserResponseDTOSchemaArray.parse(result) }).send(res);
      }
      async updateUser(req: CustomRequest<{id:number},{},UpdateUserDTO>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.userService.updateUser(req.params.id, req.body);
        new SuccessResponse({ data: UpdateUserResponseDTOSchema.parse(result) }).send(res);
      }
      async deleteUser(req: CustomRequest<{id:number},{},{}>, res: Response, next: NextFunction): Promise<void> {
        await this.userService.deleteUser(req.params.id);
        new SuccessResponse({ data: null }).send(res);
      }
      async getPaginatedUsers(req: CustomRequest<{},{},UserQueryParamsDTO>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.userService.getPaginatedUsers(req.query);
        new SuccessResponse({ data: result,
          message: "Get paginated users successfully",
         }).send(res);
      }
}
