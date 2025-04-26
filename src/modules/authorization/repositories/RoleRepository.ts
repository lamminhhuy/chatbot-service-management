import { Repository } from "typeorm";
import { AppDataSource } from "@/database/PostgresDB";
import { Role } from "../models/RoleModel";
import { IRoleRepository } from "../../user/interfaces/IRoleRepository";
import { RoleCode } from "../../user/enums/Role";

export class RoleRepository extends Repository<Role> implements IRoleRepository  {
  constructor() {
    super(Role, AppDataSource.manager); 
  }

  findRoleByCode (code: RoleCode): Promise<Role | null> {
    return this.findOne({ where: { code } });
  };
  
  findRoleById(id: number): Promise<Role | null> {
    return this.findOne({ where: { id } });
  }
}