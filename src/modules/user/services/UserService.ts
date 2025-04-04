import { UserRepository } from '../repositories/UserRepository';
import bcrypt from 'bcrypt';
import { User } from '../models/UserModel';
import { IUserRepository } from '../interfaces/IUserRepository';
import { RoleService } from './RoleService';
import { RoleCode } from '../enums/Role';
import { ErrorsResponse, NotFoundResponseError } from '@/shared/response/errors.response';
import { UserSession } from '../models/UserSessionModel';
import { Repository } from 'typeorm';
import { ICreateUserSession } from '../interfaces/ICreateUserSession';
import { ICreateUser } from '../interfaces/ICreateUser';
import { inject, injectable } from 'tsyringe';

@injectable()
export class UserService {
  private userRepo: IUserRepository;
  private roleService: RoleService;
  private userSessionRepo: Repository<UserSession>
  
  constructor(@inject('IUserRepository') userRepo: IUserRepository,@inject(RoleService) roleService: RoleService,@inject('UserSessionRepository') userSessionRepo:  Repository<UserSession> ) {
    this.userRepo =  userRepo;
    this.roleService = roleService;
    this.userSessionRepo = userSessionRepo;
  }
  
  async createUser({password,email,username, phoneNumber}: ICreateUser): Promise<User> {

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

  async findUserById(userId: number): Promise<User | null> {
    return this.userRepo.findUserById(userId);
  }

  async updateUser(userId: number, updateData: User): Promise<User> {
    const user = await this.userRepo.findUserById(userId);
    if (!user) {
      throw new NotFoundResponseError('User not found');
    }
    Object.assign(user, updateData);
    return this.userRepo.save(user);
  } 
  async createUserSession(createUserSession: Pick<UserSession, 'accessToken' | 'refreshToken' | 'user'>): Promise<UserSession> {
  return await this.userSessionRepo.save(createUserSession);
  }
  
  async getProfile(userId: number): Promise<User> {
    const result =await  this.userRepo.findUserById(userId);
    if(!result) {
      throw new NotFoundResponseError('User not found')
    }
    return result
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findByEmail(email);
  }

  async handleUpdateTokens(accessToken: string, refreshToken: string, oldRefreshToken: string): Promise<void> {
    await this.userSessionRepo.update({ refreshToken: oldRefreshToken }, { accessToken, refreshToken });
  }

  async findUserActiveRefreshToken(refreshToken: string): Promise<UserSession | null> {
    return this.userSessionRepo.findOneBy({ refreshToken,isRevoked: false });
  }

  async findUserActiveAccessToken(accessToken: string): Promise<UserSession | null> {
    return await this.userSessionRepo.findOneBy({ accessToken, isRevoked: false });
  }
}