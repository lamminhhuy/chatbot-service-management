import { DeleteResult } from "typeorm";
import { RoleCode } from "../enums/Role";
import { Role } from "@/modules/authorization/models/RoleModel";

export interface IRoleRepository {
    findRoleByCode: (code: RoleCode) => Promise<Role | null>,
    findRoleById: (id: number) => Promise<Role | null>;
    save: (roleData: Role) => Promise<Role>;
    getAllRoles: () => Promise<Role[]>;
    createRole(roleData: Role): Promise<Role>;
    delete(id: number): Promise<DeleteResult>;
}
