
import { inject, injectable } from "tsyringe";
import { UserService } from "../services/UserService";
import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "@/shared/response/success.response";
import { UserResponseDTOSchema } from "../dtos/UserResponse.dto";
import { CustomRequest } from "@/shared/interfaces/CustomRequest";
import { CreateUserDTO, CreateUserResponseSchema } from "../dtos/CreateUser.dto";
import { UpdatePasswordDTO, UpdateUserDTO, UpdateUserResponseDTOSchema } from "../dtos/UpdateUser.dto";

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

    async update(req: CustomRequest<{id:number},{},UpdateUserDTO>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.userService.updateUser(req.params.id, req.body);
        new SuccessResponse({ data: UpdateUserResponseDTOSchema.parse(result) }).send(res);
      }
    async updatePassword(req: CustomRequest<{},UpdatePasswordDTO>, res: Response, next: NextFunction): Promise<void> {
        await this.userService.updatePassword(req.user.id, req.body);
        new SuccessResponse({ data: null}).send(res);
      }
}