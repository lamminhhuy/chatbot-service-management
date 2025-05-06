import { Repository, DataSource, In } from "typeorm";
import { User } from "../models/UserModel";
import { AppDataSource } from "@/database/PostgresDB";
import { IUserRepository } from "../interfaces/IUserRepository";
import { RoleCode } from "../enums/Role";

export class UserRepository extends Repository<User> implements IUserRepository {
  constructor() {
    super(User, AppDataSource.manager); 
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.findOneBy({ email });
  }
 async findUserById(id: number): Promise<User | null> {
    return await this.findOneBy({ id });
  }
  async findAll(): Promise<User[]> {
    return await this.createQueryBuilder("user")
      .leftJoinAndSelect("user.roles", "role")
      .where("role.code != :basic", { basic: RoleCode.BASIC_USER })
      .getMany();
  }
  
  async findById(id: number): Promise<User | null> {
    return await this.findOneBy({ id });
  }
  async isExistedByPhoneNumber(phoneNumber: string): Promise<boolean> {
    return await this.existsBy({ phoneNumber });
  }
  async isExistedByEmail(email: string): Promise<boolean> {
    return await this.existsBy({ email });
  }
  async findUsersByRoles(roleCodes:RoleCode[]): Promise<User[]> {
    return await this.find({ where: { roles: { code:In(roleCodes) } } });
  }
}