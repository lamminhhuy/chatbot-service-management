import { inject, injectable } from "tsyringe";
import { Permission } from "../models/PermissionModel";
import { IPermissionRepository } from "../interfaces/IPermissionRepository";
@injectable()
export class PermissionService {
    constructor(
        @inject('IPermissionRepository') private readonly permissionRepository: IPermissionRepository,
    ) {}

    async findPermissionById(id: number): Promise<Permission | null> {
        return this.permissionRepository.findPermissionById(id);
    }
    async getAllPermissionByRoles(roleIds: number[]): Promise<Permission[] | null> {
        return this.permissionRepository.getAllPermissionByRoles(roleIds);
    }
    async getAllPermissionById(id: number): Promise<Permission | null> {
        return this.permissionRepository.findPermissionById(id);
    }
    async findPermissionByIds(ids: number[]): Promise<Permission[] | null> {
        return this.permissionRepository.findPermissionByIds(ids);
    }
    async getAllPermission(): Promise<Permission[] | null> {
        return this.permissionRepository.getAllPermission();
    }
}
