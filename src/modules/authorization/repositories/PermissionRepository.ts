import { Repository } from "typeorm";
import { IPermissionRepository } from "../interfaces/IPermissionRepository";
import { Permission } from "../models/PermissionModel";
import { AppDataSource } from "@/database/PostgresDB";

export class PermissionRepository extends Repository<Permission> implements IPermissionRepository {
    constructor() {
        super(Permission, AppDataSource.manager);
    }

    findPermissionById(id: number): Promise<Permission | null> {
        return this.findOne({ where: { id } });
    }
}