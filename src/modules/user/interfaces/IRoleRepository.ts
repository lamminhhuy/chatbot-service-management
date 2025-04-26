import { Repository } from "typeorm";
import { RoleCode } from "../enums/Role";
import { Role } from "@/modules/authorization/models/RoleModel";

export interface IRoleRepository {
    findRoleByCode: (code: RoleCode) => Promise<Role | null>,
    findRoleById: (id: number) => Promise<Role | null>;
    create: (roleData: Role) => Promise<Role>;
    save: (roleData: Role) => Promise<Role>;
}