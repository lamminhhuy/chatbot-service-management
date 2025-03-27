import { Repository, DataSource } from "typeorm";
import { User } from "../models/UserModel";
import { AppDataSource } from "@/database/PostgresDB";
import { IUserRepository } from "../interfaces/IUserRepository";

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
}