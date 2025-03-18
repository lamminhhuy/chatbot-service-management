import { User } from "@/shared/entites/User";
import { IUserRepository } from "@/shared/interfaces/repositories/IUserRepository";
import { BadRequestResponseError } from "@/shared/response/errors.response";

export class UserService {
    private repository: IUserRepository;
    constructor(repository: IUserRepository) {
        this.repository = repository;
    }
    public async register(email: string, password: string) {
      const existingUser = await this.repository.getUserByEmail(email)
        if (existingUser) {
            throw new BadRequestResponseError('Email already exists');
        }
        const user = new User();
        user.email = email;
        user.password = password;
        user.status = 'active';
        user.emailVerified = false;
        
    }
}