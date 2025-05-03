import { UserRepository } from "../repositories/UserRepository";
import * as argon2 from "argon2";
import { User } from "../models/UserModel";
import { IUserRepository } from "../interfaces/IUserRepository";
import { RoleCode } from "../enums/Role";
import {
  BadRequestResponseError,
  ErrorsResponse,
  NotFoundResponseError,
} from "@/shared/response/errors.response";
import { UserSession } from "../models/UserSessionModel";
import { Repository } from "typeorm";
import { inject, injectable } from "tsyringe";
import UserFactory from "../factories/user.factory";
import { CreateUserDTO } from "../dtos/CreateUser.dto";
import UserSubscriptionService from "@/modules/subscription/services/UserSubscriptionService";
import { Subscription } from "@/modules/subscription/models/Subscription";
import { UserSubscription } from "@/modules/subscription/models/UserSubscription";
import { SubscriptionCode } from "@/modules/subscription/enums/SubscriptionCode";
import SubscriptionService from "@/modules/subscription/services/SubscriptionService";
import { AssignRoleDTO } from "../dtos/AssignRole.dto";
import { Role } from "@/shared/enums/Role";
import { RemoveRoleDTO } from "../dtos/RemoveRole.dto";
import { hashPassword } from "../utils/hashPassword";
import { UpdatePasswordDTO, UpdateUserDTO } from "../dtos/UpdateUser.dto";
import { UserResponseDTO, UserResponseDTOSchema } from "../dtos/UserResponse.dto";
import { RoleService } from "@/modules/authorization/services/RoleService";

@injectable()
export class UserService {
  private userRepo: IUserRepository;
  private roleService: RoleService;
  private userSessionRepo: Repository<UserSession>;

  constructor(
    @inject("IUserRepository") userRepo: IUserRepository,
    @inject(RoleService) roleService: RoleService,
    @inject("UserSessionRepository") userSessionRepo: Repository<UserSession>,
    @inject(SubscriptionService) private subscriptionService: SubscriptionService, 
    @inject(UserSubscriptionService) private userSubscriptionService: UserSubscriptionService
  ) {
    this.userRepo = userRepo;
    this.subscriptionService = subscriptionService;
    this.roleService = roleService;
    this.userSessionRepo = userSessionRepo;
  }

  async createUser({
    password,
    email,
    username,
    phoneNumber,
    roleId
  }: CreateUserDTO): Promise<User> {
    await this.validateUserInput({ email, phoneNumber });

    const roles = []
    const basicUserRole = await this.roleService.findRoleByCode(
      RoleCode.BASIC_USER
    );

    if (!basicUserRole) {
      throw new ErrorsResponse("Role Basic is not existed", 408);
    }

    roles.push(basicUserRole)
 
    if(roleId) {
      const role = await this.roleService.findRolebyId(roleId);
      if(!role) {
        throw new NotFoundResponseError("Role not found");
      }
      roles.push(role)
    }
 
    const user = await UserFactory.create({
      password,
      email,
      username,
      phoneNumber,
      avatarUrl: null,
      roles,
    });
    const savedUser = await this.userRepo.save(user);
  
    return savedUser;
  }

  async findUserById(userId: number): Promise<User | null> {
    return this.userRepo.findUserById(userId);
  }

  async updateUser(userId: number, input: UpdateUserDTO): Promise<User> {
    const user = await this.userRepo.findUserById(userId);

    if (!user) {
      throw new NotFoundResponseError("User not found");
    }

    await this.validateUserInput({ email: input.email, phoneNumber: input.phoneNumber });
    
    Object.assign(user, input);
    return this.userRepo.save(user);
  }
  async createUserSession(
    createUserSession: Pick<
      UserSession,
      "accessToken" | "refreshToken" | "user"
    >
  ): Promise<UserSession> {
    return await this.userSessionRepo.save(createUserSession);
  }

  async getProfile(userId: number): Promise<UserResponseDTO> {
    const user = await this.userRepo.findUserById(userId);
    const userSubscription = await this.userSubscriptionService.getActiveUserSubsription(userId);
    if(!userSubscription) {
      throw new NotFoundResponseError("User subscription not found");
    }
    if (!user) {
      throw new NotFoundResponseError("User not found");
    }
    const sanitizedUser = UserResponseDTOSchema.parse({
      ...user,
      userSubscription
    })
    return sanitizedUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findByEmail(email);
  }

  async handleUpdateTokens(
    accessToken: string,
    refreshToken: string,
    oldRefreshToken: string
  ): Promise<void> {
    await this.userSessionRepo.update(
      { refreshToken: oldRefreshToken },
      { accessToken, refreshToken }
    );
  }

  async findUserActiveRefreshToken(
    refreshToken: string
  ): Promise<UserSession | null> {
    return this.userSessionRepo.findOneBy({ refreshToken, isRevoked: false });
  }

  async findUserActiveAccessToken(
    accessToken: string
  ): Promise<UserSession | null> {
    return await this.userSessionRepo.findOneBy({
      accessToken,
      isRevoked: false,
    });
  }
  async revokeToken(refreshToken: string): Promise<void> {
    await this.userSessionRepo.update({ refreshToken }, { isRevoked: true });
  }

  async  assignRole(input: AssignRoleDTO): Promise<User> {
    const role = await this.roleService.findRolebyId(input.roleId);
    if(!role) {
      throw new NotFoundResponseError("Role not found");
    }
    const user = await this.userRepo.findUserById(input.userId);
    if(!user) {
      throw new NotFoundResponseError("User not found");
    }
    user.roles.push(role);
    return this.userRepo.save(user);
  }
  async removeRole(input: RemoveRoleDTO){
    const role = await this.roleService.findRolebyId(input.roleId);
    if(!role) {
      throw new NotFoundResponseError("Role not found");
    }
    const user = await this.userRepo.findUserById(input.userId);
    if(!user) {
      throw new NotFoundResponseError("User not found");
    }
     user.removeRole(role);
    return this.userRepo.save(user);
  }
  async updatePassword(userId: number, input: UpdatePasswordDTO): Promise<User> {
    const user = await this.userRepo.findUserById(userId);
    if (!user) {
      throw new NotFoundResponseError("User not found");
    }
    const isPasswordValid = await argon2.verify(user.password, input.oldPassword);
    if(!isPasswordValid) {
      throw new BadRequestResponseError('Invalid old password!');
    } 
    user.password = await hashPassword(input.newPassword);
    return this.userRepo.save(user);
  }

  async resetPassword(userId: number, newPassword: string): Promise<User> {
    const user = await this.userRepo.findUserById(userId)
    if (!user) {
      throw new BadRequestResponseError('User not found!')
    }
    user.password = await hashPassword(newPassword)
    return this.userRepo.save(user)
  }
private async validateUserInput({ email, phoneNumber }: { email: string; phoneNumber: string | null }): Promise<void> {
  const emailExists = await this.userRepo.isExistedByEmail(email);
  if (emailExists) {
    throw new BadRequestResponseError('Email is already taken');
  }

  if (phoneNumber) {
    const phoneNumberExists = await this.userRepo.isExistedByPhoneNumber(phoneNumber);
    if (phoneNumberExists) {
      throw new BadRequestResponseError('Phone number is already taken');
    }
  }
}

}
