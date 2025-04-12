import { Repository } from "typeorm";
import { RoleCode } from "../enums/Role";
import { Role } from "../../role/models/RoleModel";

export interface IRoleRepository extends Repository<Role> {
    findRoleByCode: (code: RoleCode) => Promise<Role | null>,
    findRoleById: (id: number) => Promise<Role | null>;
}