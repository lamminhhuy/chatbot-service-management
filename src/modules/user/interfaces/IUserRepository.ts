import { User } from "../models/UserModel";

export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>,
    save(user: User): Promise<User>,
    findUserById(id: number): Promise<User | null>
}
