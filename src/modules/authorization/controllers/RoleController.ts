import { RoleService } from "@/modules/authorization/services/RoleService";
import { CustomRequest } from "@/shared/interfaces/CustomRequest";
import { NextFunction, Response } from "express";
import { inject, injectable } from "tsyringe";
import { AssignPermissionDTO, RevokePermissionDTO } from "../dtos/AssignPermission.dto";

@injectable()
class RoleController {
    constructor(
        @inject(RoleService) private readonly roleService: RoleService,
    ) {}

    async handleAssignPermissions(req: CustomRequest<{roleId:number},{},AssignPermissionDTO>,res:Response, next:NextFunction): Promise<void> {
    await this.roleService.assignPermission(req.params.roleId, req.body.permissionIds);
    }

    async handleRevokePermission(req: CustomRequest<{roleId:number},{},RevokePermissionDTO>,res:Response, next:NextFunction): Promise<void> {
    await this.roleService.revokePermission(req.params.roleId, req.body.permissionIds);
    }
}

export default RoleController
