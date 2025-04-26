import { inject } from "tsyringe";
import { Permission } from "../models/PermissionModel";
import { IPermissionRepository } from "../interfaces/IPermissionRepository";

export class PermissionService {
    constructor(
        @inject('IPermissionRepository') private readonly permissionRepository: IPermissionRepository,
    ) {}

    async findPermissionById(id: number): Promise<Permission | null> {
        return this.permissionRepository.findPermissionById(id);
    }
}
