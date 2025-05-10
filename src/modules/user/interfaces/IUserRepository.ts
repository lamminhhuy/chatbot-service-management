import { IGenericRepository } from "@/shared/interfaces/IGenericRepository";
import { User } from "../models/UserModel";
import { Role } from "@/modules/authorization/models/RoleModel";
import { RoleCode } from "../enums/Role";
import { UserQueryParamsDTO } from "../dtos/UserQueryParamss.dto";

export interface IUserRepository extends IGenericRepository<User> {
    findByEmail(email: string): Promise<User | null>,
    save(user: User): Promise<User>,
    findUserById(id: number): Promise<User | null>,
    isExistedByEmail(email: string): Promise<boolean>,
    isExistedByPhoneNumber(phoneNumber: string): Promise<boolean>,
    remove(user: User): Promise<User>,
    findUsersByRoles(roleCodes:RoleCode[]): Promise<User[]>,
    getNewUsersFromLastMonthCount(includeDeleted?: boolean): Promise<number>,
    softDeleteUser(id: number): Promise<void>,
    restoreUser(id: number): Promise<void>,
    getUserCountWithMonthlyGrowth(): Promise<{total: number; currentMonth: number; previousMonth: number; growthRate: number}>,
    getPaginatedUsers(queryParams: UserQueryParamsDTO): Promise<{items: User[], total: number}>,
    saveOrReplaceSoftDeletedUser(newUser: User): Promise<User>,
    restoreAndUpdateSoftDeletedUser(data: User): Promise<User>
}
