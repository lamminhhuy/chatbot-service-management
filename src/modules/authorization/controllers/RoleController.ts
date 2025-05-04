import { RoleService } from "@/modules/authorization/services/RoleService";
import { CustomRequest } from "@/shared/interfaces/CustomRequest";
import { NextFunction, Response } from "express";
import { inject, injectable } from "tsyringe";
import { AssignPermissionDTO, RevokePermissionDTO } from "../dtos/AssignPermission.dto";
import { SuccessResponse } from "@/shared/response/success.response";
import { PermissionService } from "../services/PermissionService";
import { CreateRoleDTO } from "../dtos/CreateRole.dto";
import { UpdateRoleDTO } from "../dtos/UpdateRole.dto";
import { PermissionsResponseDTOSchema } from "../dtos/PermissionsResponse.dto";

@injectable()
class RoleController {
    constructor(
        @inject(RoleService) private readonly roleService: RoleService,
        @inject(PermissionService) private readonly permissionService: PermissionService
    ) {}

    async handleAssignPermissions(req: CustomRequest<{roleId:number},{},AssignPermissionDTO>,res:Response, next:NextFunction): Promise<void> {
    const result = await this.roleService.assignPermission(req.params.roleId, req.body.permissionIds);
    new SuccessResponse({
        message: 'Permission assigned successfully',
        data: result
    }).send(res);
    }

    async handleRevokePermission(req: CustomRequest<{roleId:number},{},RevokePermissionDTO>,res:Response, next:NextFunction): Promise<void> {
    const result = await this.roleService.revokePermission(req.params.roleId, req.body.permissionIds);
    new SuccessResponse({
        message: 'Permission revoked successfully',
        data: result
    }).send(res);
    }

    async handleGetAllPermission(req: CustomRequest<{roleId:number},{},RevokePermissionDTO>,res:Response, next:NextFunction): Promise<void> {
    const result = await this.permissionService.getAllPermission();
    new SuccessResponse({
        message: 'Permission fetched successfully',
        data: PermissionsResponseDTOSchema.parse(result)
    }).send(res);
    }
    async handleGetAllRoles(req: CustomRequest<{roleId:number},{},RevokePermissionDTO>,res:Response, next:NextFunction): Promise<void> {
    const result = await this.roleService.getAllRoles();
    new SuccessResponse({
        message: 'Roles fetched successfully',
        data: result
    }).send(res);
    }
    async handleCreateRole(req: CustomRequest<{roleId:number},{},CreateRoleDTO>,res:Response, next:NextFunction): Promise<void> {
    const result = await this.roleService.createRole(req.body);
    new SuccessResponse({
        message: 'Role created successfully',
        data: result
    }).send(res);
    }
    async handleUpdateRole(req: CustomRequest<{roleId:number},{},UpdateRoleDTO>,res:Response, next:NextFunction): Promise<void> {
    const result = await this.roleService.updateRole(req.params.roleId, req.body);
    new SuccessResponse({
        message: 'Role updated successfully',
        data: result
    }).send(res);
    }
    async handleDeleteRole(req: CustomRequest<{roleId:number},{},{}>,res:Response, next:NextFunction): Promise<void> {
    const result = await this.roleService.deleteRole(req.params.roleId);
    new SuccessResponse({
        message: 'Role deleted successfully',
        data: result
    }).send(res);
    }

    async handleGetAllPermissionByRoleId(req: CustomRequest<{roleId:number},{},{}>,res:Response, next:NextFunction): Promise<void> {
    const result = await this.permissionService.getAllPermissionByRoleId(req.params.roleId);
    new SuccessResponse({
        message: 'Permission fetched successfully',
        data: PermissionsResponseDTOSchema.parse(result)
    }).send(res);
    }
}


export default RoleController
