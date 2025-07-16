import { Repository } from "typeorm";
import { AppDataSource } from "@/shared/infrastructure/database/PostgresDB";
import { Role } from "../models/RoleModel";
import { IRoleRepository } from "../../user/interfaces/IRoleRepository";
import { RoleCode } from "../../user/enums/Role";
import { DeleteResult } from "typeorm";
export class RoleRepository extends Repository<Role> implements IRoleRepository  {
  constructor() {
    super(Role, AppDataSource.manager); 
  }

  findRoleByCode (code: RoleCode): Promise<Role | null> {
    return this.findOne({ where: { code }, relations: { permissions: true } });
  };
  
  findRoleById(id: number): Promise<Role | null> {
    return this.findOne({ where: { id }, relations: { permissions: true } });
  }
  getAllRoles(): Promise<Role[]> {
    return this.find({ relations: { permissions: true } });
  }
  createRole(roleData: Role): Promise<Role> {
    return this.save(roleData);
  }


}