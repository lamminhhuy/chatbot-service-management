import { container } from "tsyringe";
import { RoleRepository } from "./repositories/RoleRepository";
import { RoleService } from "../user/services/RoleService";
import { PermissionService } from "./services/PermissionService";

export function registerRoleDependencies () {
    container.register('IRoleRepository',{useClass: RoleRepository})
    container.register(RoleService,{useClass: RoleService})
    container.register(PermissionService,{useClass: PermissionService})
}