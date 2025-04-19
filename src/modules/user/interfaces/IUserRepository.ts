import { IGenericRepository } from "@/shared/interfaces/IGenericRepository";
import { User } from "../models/UserModel";

export interface IUserRepository extends IGenericRepository<User> {
    findByEmail(email: string): Promise<User | null>,
    save(user: User): Promise<User>,
    findUserById(id: number): Promise<User | null>
}
