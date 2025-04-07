
import { inject, injectable } from "tsyringe";
import { UserService } from "../services/UserService";
import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "@/shared/response/success.response";
import { UserResponseDTOSchema } from "../dtos/UserResponse.dto";
import { CustomRequest } from "@/shared/interfaces/CustomRequest";

@injectable()
export class UserController {
    constructor(@inject(UserService) private userService: UserService) {
    }
    async getProfile(req: CustomRequest<{ id: string }, {}, {}>, res: Response, next: NextFunction): Promise<void> {
     const result =   await this.userService.getProfile(parseInt(req.params.id), req.user);
            
     new SuccessResponse(
        { data: UserResponseDTOSchema.parse(result) }
     ).send(res)
    }
}