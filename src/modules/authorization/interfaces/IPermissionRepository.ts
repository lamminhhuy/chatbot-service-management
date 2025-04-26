import { Permission } from "../models/PermissionModel";

export interface IPermissionRepository {
    findPermissionById: (id: number) => Promise<Permission | null>;
}