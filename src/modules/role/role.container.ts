import { container } from "tsyringe";
import { RoleRepository } from "./repositories/RoleRepository";
import { RoleService } from "../user/services/RoleService";

export function registerRoleDependencies () {
    container.register('IRoleRepository',{useClass: RoleRepository})
    container.register(RoleService,{useClass: RoleService})
}