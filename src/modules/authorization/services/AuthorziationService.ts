import { BadRequestResponseError } from "@/shared/response/errors.response";
import { inject, injectable } from "tsyringe";
import { PermissionService } from "./PermissionService";
import { User } from "@/modules/user/models/UserModel";

@injectable()
export class AuthorizationService {
    constructor(
        @inject(PermissionService) private readonly permissionService: PermissionService,
    ) {}
    
    async checkPermission(user: User, permissionCode: string): Promise<boolean> {
        const permissions = await this.permissionService.getAllPermissionByRoles(user.roles.map(role => role.id));
        if (!permissions) throw new BadRequestResponseError('Permission not found');
        return permissions.some(permission => permission.code === permissionCode);
    }
}