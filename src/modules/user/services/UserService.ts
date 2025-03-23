import { UserRepository } from '../repositories/UserRepository';
import bcrypt from 'bcrypt';
import { CreateUserDto } from '@/shared/dtos/User';
import { User } from '../models/UserModel';
import { IUserRepository } from '../interfaces/IUserRepository';
import { RoleService } from './RoleService';
import { RoleCode } from '../enums/Role';
import { ErrorsResponse } from '@/shared/response/errors.response';
import { Role } from '../models/RoleModel';

export class UserService {
  private userRepo: IUserRepository;
  private roleService: RoleService;
  constructor(userRepo: IUserRepository, roleService: RoleService) {
    this.userRepo =  userRepo;
    this.roleService = roleService
  }

  async createUser({password,email,username, phoneNumber}: CreateUserDto): Promise<User> {

    const basicUserRole = await this.roleService.findRoleByCode(RoleCode.BASIC_USER)
    if(!basicUserRole)
    {
      throw new ErrorsResponse('Role Basic is not existed',408)
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User();
    user.email = email;
    user.username = username;
    user.phoneNumber = phoneNumber ?? null;
    user.password = hashedPassword;
    user.avatarUrl = '';
    user.emailVerified= true;
    user.roles= [
       basicUserRole]
    const savedUser = await this.userRepo.save(user);
     return savedUser
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findByEmail(email);
  }
}