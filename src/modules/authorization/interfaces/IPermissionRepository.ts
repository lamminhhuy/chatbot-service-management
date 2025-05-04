import { Permission } from "../models/PermissionModel";

export interface IPermissionRepository {
    findPermissionById: (id: number) => Promise<Permission | null>;
    getAllPermissionByRoles: (roleIds: number[]) => Promise<Permission[] | null>;
    findPermissionByIds: (ids: number[]) => Promise<Permission[] | null>;
    getAllPermission: () => Promise<Permission[] | null>;
    getAllPermissionByRole: (roleId: number) => Promise<Permission[] | null>;
}