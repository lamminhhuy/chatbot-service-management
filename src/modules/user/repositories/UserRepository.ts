import { getRepository, Repository } from "typeorm";
import { IUserRepository } from "@/shared/interfaces/repositories/IUserRepository";
import { User } from "@/shared/entites/User";

export class UserRepository implements IUserRepository {
    private repository: Repository<User>;
  
    constructor() {
      this.repository = getRepository(User);
    }
    createUser(user: User): Promise<User> {
      return this.repository.save(user);
    }
 
  }