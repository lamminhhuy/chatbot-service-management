import { User } from "@/shared/entites/User";

export interface IUserRepository {
    findByGoogleId(googleId: string): Promise<User | undefined>;
    getUserById(id: string): Promise<User>;
    getUserByEmail(email: string): Promise<User>;
    createUser(user: User): Promise<User>;
    updateUser(user: User): Promise<User>;
    deleteUser(id: string): Promise<void>;
}