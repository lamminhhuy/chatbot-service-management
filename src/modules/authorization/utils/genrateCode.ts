import { RoleCode } from "@/modules/user/enums/Role";

export function generateCode(name: string): RoleCode{
    return name.replace(/\s/g, '-').toLocaleUpperCase() as RoleCode;
}