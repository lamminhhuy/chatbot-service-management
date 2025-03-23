import { Repository, DataSource } from "typeorm";
import { User } from "../models/UserModel";
import { AppDataSource } from "@/database/PostgresDB";
import { IUserRepository } from "../interfaces/IUserRepository";


export class UserRepository extends Repository<User> implements IUserRepository {
  private repository: Repository<User>;

  constructor() {
    super(User, AppDataSource.manager); 
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }

}