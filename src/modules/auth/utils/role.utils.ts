import { Role } from "@/modules/role/models/RoleModel";
import { RoleCode } from "@/modules/user/enums/Role";

export const isUserRole = (roles: Role[]) => {
    return roles.some(role => role.code === RoleCode.BASIC_USER || role.code === RoleCode.ADVANCED_USER || role.code === RoleCode.PRO_USER);
}

