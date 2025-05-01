import { container } from "tsyringe";
import { RoleRepository } from "./repositories/RoleRepository";
import { PermissionService } from "./services/PermissionService";
import { PermissionRepository } from "./repositories/PermissionRepository";
import { RoleService } from "./services/RoleService";

export function registerRoleDependencies () {
    container.register('IRoleRepository',{useClass: RoleRepository})
    container.register(RoleService,{useClass: RoleService})
    container.register('IPermissionRepository', { useClass: PermissionRepository })
    container.register(PermissionService,{useClass: PermissionService})
}