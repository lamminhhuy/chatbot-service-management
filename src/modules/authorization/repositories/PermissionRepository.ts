import { In, Repository } from "typeorm";
import { IPermissionRepository } from "../interfaces/IPermissionRepository";
import { Permission } from "../models/PermissionModel";
import { AppDataSource } from "@/database/PostgresDB";
import { BadRequestResponseError } from "@/shared/response/errors.response";

export class PermissionRepository extends Repository<Permission> implements IPermissionRepository {
    constructor() {
        super(Permission, AppDataSource.manager);
    }

    findPermissionById(id: number): Promise<Permission | null> {
        return this.findOne({ where: { id } });
    }
    getAllPermissionByRoles(roleIds: number[]): Promise<Permission[] | null> {
        return this.find({ where: { roles: { id: In(roleIds) } } });
    }
  async  findPermissionByIds(ids: number[]): Promise<Permission[]> {
        const permissions = await this.find({ where: { id: In(ids) } });

        return permissions;
    }
    async getAllPermission(): Promise<Permission[] | null> {
        return this.find();
    }
   getAllPermissionByRole(roleId: number): Promise<Permission[] | null> {
        return this.find({ where: { roles: { id: roleId } } });
    }
}