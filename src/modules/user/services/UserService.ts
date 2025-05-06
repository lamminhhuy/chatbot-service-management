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
import { AssignRoleDTO } from "../dtos/AssignRole.dto";
import { RemoveRoleDTO } from "../dtos/RemoveRole.dto";
import { hashPassword } from "../utils/hashPassword";
import { UpdatePasswordDTO, UpdateUserDTO } from "../dtos/UpdateUser.dto";
import {
  UserResponseDTO,
  UserResponseDTOSchema,
} from "../dtos/UserResponse.dto";
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
    @inject(UserSubscriptionService)
    private userSubscriptionService: UserSubscriptionService
  ) {
    this.userRepo = userRepo;
    this.roleService = roleService;
    this.userSessionRepo = userSessionRepo;
  }

  async createUser({
    password,
    email,
    username,
    phoneNumber,
    roleId,
  }: CreateUserDTO): Promise<User> {
    await this.isExistedEmail(email);
    if (phoneNumber) {
      await this.isExistedPhoneNumber(phoneNumber);
    }
    const roles = [];
    const basicUserRole = await this.roleService.findRoleByCode(
      RoleCode.BASIC_USER
    );

    if (!basicUserRole) {
      throw new ErrorsResponse("Role Basic is not existed", 408);
    }

    roles.push(basicUserRole);

    if (roleId) {
      const role = await this.roleService.findRolebyId(roleId);
      if (!role) {
        throw new NotFoundResponseError("Role not found");
      }
      roles.push(role);
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

  async updateMe(userId: number, input: UpdateUserDTO): Promise<User> {
    const user = await this.userRepo.findUserById(userId);

    if (!user) {
      throw new NotFoundResponseError("User not found");
    }

    if (user.email !== input.email) {
      await this.isExistedEmail(input.email);
    }
    if (input.phoneNumber && user.phoneNumber !== input.phoneNumber) {
      await this.isExistedPhoneNumber(input.phoneNumber);
    }
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
    const userSubscription =
      await this.userSubscriptionService.getActiveUserSubsription(userId);
    if (!userSubscription) {
      throw new NotFoundResponseError("User subscription not found");
    }
    if (!user) {
      throw new NotFoundResponseError("User not found");
    }
    const sanitizedUser = UserResponseDTOSchema.parse({
      ...user,
      userSubscription,
    });
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

  async assignRole(input: AssignRoleDTO): Promise<User> {
    const role = await this.roleService.findRolebyId(input.roleId);
    if (!role) {
      throw new NotFoundResponseError("Role not found");
    }
    const user = await this.userRepo.findUserById(input.userId);
    if (!user) {
      throw new NotFoundResponseError("User not found");
    }
    const isRoleExists = user.roles.some((r) => r.id === role.id);
    if (isRoleExists) {
      throw new BadRequestResponseError("Role already exists");
    }
    user.roles.push(role);
    return this.userRepo.save(user);
  }
  async removeRole(input: RemoveRoleDTO) {
    const role = await this.roleService.findRolebyId(input.roleId);
    if (!role) {
      throw new NotFoundResponseError("Role not found");
    }
    const user = await this.userRepo.findUserById(input.userId);
    if (!user) {
      throw new NotFoundResponseError("User not found");
    }
    user.removeRole(role);
    return this.userRepo.save(user);
  }
  async updatePassword(
    userId: number,
    input: UpdatePasswordDTO
  ): Promise<User> {
    const user = await this.userRepo.findUserById(userId);
    if (!user) {
      throw new NotFoundResponseError("User not found");
    }
    const isPasswordValid = await argon2.verify(
      user.password,
      input.oldPassword
    );
    if (!isPasswordValid) {
      throw new BadRequestResponseError("Invalid old password!");
    }
    user.password = await hashPassword(input.newPassword);
    return this.userRepo.save(user);
  }

  async resetPassword(userId: number, newPassword: string): Promise<User> {
    const user = await this.userRepo.findUserById(userId);
    if (!user) {
      throw new BadRequestResponseError("User not found!");
    }
    user.password = await hashPassword(newPassword);
    return this.userRepo.save(user);
  }

  private async isExistedEmail(email: string): Promise<void> {
    const emailExists = await this.userRepo.isExistedByEmail(email);
    if (emailExists) {
      throw new BadRequestResponseError("Email is already taken");
    }
  }

  private async isExistedPhoneNumber(phoneNumber: string): Promise<void> {
    const phoneNumberExists = await this.userRepo.isExistedByPhoneNumber(
      phoneNumber
    );
    if (phoneNumberExists) {
      throw new BadRequestResponseError("Phone number is already taken");
    }
  }

  async getAll(): Promise<User[]> {
    return this.userRepo.findAll();
  }
  async updateUser(userId: number, input: UpdateUserDTO) {
    const user = await this.userRepo.findUserById(userId);
    if (!user) {
      throw new NotFoundResponseError("User not found");
    }
    if (user.email !== input.email) {
      await this.isExistedEmail(input.email);
    }
    if (input.phoneNumber && user.phoneNumber !== input.phoneNumber) {
      await this.isExistedPhoneNumber(input.phoneNumber);
    }
    Object.assign(user, input);
    return this.userRepo.save(user);
  }
  async deleteUser(userId: number) {
    const user = await this.userRepo.findUserById(userId);
    if (!user) {
      throw new NotFoundResponseError("User not found");
    }
    const isAdminUser = user.roles.some((r) => r.code === RoleCode.ADMIN);
    if (isAdminUser) {
      const adminUsers = await this.userRepo.findUsersByRoles([RoleCode.ADMIN]);
      if (!adminUsers.length) {
        throw new BadRequestResponseError("At least one admin user must exist");
      }
    }
    return this.userRepo.remove(user);
  }
}
