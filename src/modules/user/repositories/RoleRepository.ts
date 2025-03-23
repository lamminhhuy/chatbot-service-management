import { Repository, DataSource } from "typeorm";
import { User } from "../models/UserModel";
import { AppDataSource } from "@/database/PostgresDB";
import { IUserRepository } from "../interfaces/IUserRepository";
import { Role } from "../models/RoleModel";
import { IRoleRepository } from "../interfaces/IRoleRepository";
import { RoleCode } from "../enums/Role";

export class RoleRepository extends Repository<Role> implements IRoleRepository  {
  constructor() {
    super(Role, AppDataSource.manager); 
  }

  findRoleByCode (code: RoleCode): Promise<Role | null> {
    return this.findOne({ where: { code } });
  };
}