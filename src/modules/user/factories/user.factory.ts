
import { UserCreationDTO } from "../interfaces/ICreateUser";
import { User } from "../models/UserModel";
import { hashPassword } from "../utils/hashPassword";

class UserFactory {

static async create({password,email,username, phoneNumber, avatarUrl, roles, resourceRegister}: UserCreationDTO ): Promise<User> {
const hashedPassword = await hashPassword(password)
const user = new User(email, username, phoneNumber, hashedPassword, avatarUrl, roles);
user.resourceRegister = resourceRegister;
return user;
}
}

export default UserFactory;