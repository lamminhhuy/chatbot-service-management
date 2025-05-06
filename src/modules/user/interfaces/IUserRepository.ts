import { IGenericRepository } from "@/shared/interfaces/IGenericRepository";
import { User } from "../models/UserModel";
import { Role } from "@/modules/authorization/models/RoleModel";
import { RoleCode } from "../enums/Role";

export interface IUserRepository extends IGenericRepository<User> {
    findByEmail(email: string): Promise<User | null>,
    save(user: User): Promise<User>,
    findUserById(id: number): Promise<User | null>,
    isExistedByEmail(email: string): Promise<boolean>,
    isExistedByPhoneNumber(phoneNumber: string): Promise<boolean>,
    remove(user: User): Promise<User>,
    findUsersByRoles(roleCodes:RoleCode[]): Promise<User[]>
}
