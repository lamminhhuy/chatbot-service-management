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
import { Repository, UpdateResult } from "typeorm";
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
import {
  PaginatedResponse,
  PaginatedResponseSchema,
} from "@/shared/dtos/PaginatedResponse.dto";
import { UserQueryParamsDTO } from "../dtos/UserQueryParamss.dto";
import { buildPaginatedResponse } from "@/shared/utils/buildPaginatedResponse";
import { UserSubscription } from "@/modules/subscription/models/UserSubscription";
import { SubscriptionCode } from "@/modules/subscription/enums/SubscriptionCode";
import SubscriptionService from "@/modules/subscription/services/SubscriptionService";
import { UserDTO, UserDTOSchema } from "../dtos/User.dto";
import { Transactional } from "typeorm-transactional";

@injectable()
export class UserService {
  private userRepo: IUserRepository;
  private roleService: RoleService;
  private userSessionRepo: Repository<UserSession>;

  constructor(
    @inject("IUserRepository") userRepo: IUserRepository,
    @inject(RoleService) roleService: RoleService,
    @inject("IUserSessionRepository") userSessionRepo: Repository<UserSession>,
    @inject(UserSubscriptionService)
    private userSubscriptionService: UserSubscriptionService,
    @inject(SubscriptionService)
    private subscriptionService: SubscriptionService
  ) {
    this.userRepo = userRepo;
    this.roleService = roleService;
    this.userSessionRepo = userSessionRepo;
  }
 @Transactional()
  async createUserThroughGoogleLogin({
    password,
    email,
    username,
    phoneNumber,
  }: CreateUserDTO): Promise<UserDTO> {
    const basicUserRole = await this.roleService.findRoleByCode(
      RoleCode.BASIC_USER
    );
    if (!basicUserRole) {
      throw new ErrorsResponse("Role Basic is not existed", 408);
    }
    const user = await UserFactory.create({
      password,
      email,
      username,
      phoneNumber,
      avatarUrl: null,
      roles: [basicUserRole],
    });

    const savedUser = await this.userRepo.restoreAndUpdateSoftDeletedUser(user);

    const subscription = await this.subscriptionService.findByCode(
      SubscriptionCode.BASIC
    );
    if (!subscription) {
      throw new ErrorsResponse("Basic subscription is not existed", 408);
    }

    const userSubscription = await this.userSubscriptionService.create({
      userId:  savedUser.id,
      subscriptionId: subscription.id,
    });

    return UserDTOSchema.parse({
      ...savedUser,
      userSubscription,
    });
  }
  @Transactional()
  async createUser({
    password,
    email,
    username,
    phoneNumber,
    roleId,
  }: CreateUserDTO): Promise<UserDTO> {
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

    if (roleId) {
      const role = await this.roleService.findRolebyId(roleId);
      if (!role) {
        throw new NotFoundResponseError("Role not found");
      }
      roles.push(role);
    } else {
      roles.push(basicUserRole);
    }

    const user = await UserFactory.create({
      password,
      email,
      username,
      phoneNumber,
      avatarUrl: null,
      roles,
    });
    const savedUser = await this.userRepo.saveOrReplaceSoftDeletedUser(user);

    const subscription = await this.subscriptionService.findByCode(
      SubscriptionCode.BASIC
    );
    if (!subscription) {
      throw new ErrorsResponse("Basic subscription is not existed", 408);
    }

    const userSubscription = await this.userSubscriptionService.create({
      userId: user.id,
      subscriptionId: subscription.id,
    });

    return UserDTOSchema.parse({
      ...savedUser,
      userSubscription,
    });
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
  async createUserSession(createUserSession: {
    accessToken: string;
    refreshToken: string;
    userId: number;
  }): Promise<UserSession> {
    const user = await this.userRepo.findUserById(createUserSession.userId);
    if (!user) {
      throw new NotFoundResponseError("User not found");
    }
    const userSession = UserSession.create({
      accessToken: createUserSession.accessToken,
      refreshToken: createUserSession.refreshToken,
      user,
    });
    return await this.userSessionRepo.save(userSession);
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

  async findByEmail(email: string): Promise<UserDTO | null> {
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      return null;
    }

    const userSubscription =
      await this.userSubscriptionService.getActiveUserSubsription(user.id);

    const parsed = UserDTOSchema.safeParse({ ...user, userSubscription });

    if (!parsed.success) {
      return null;
    }

    return parsed.data;
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
    user.assginRole(role);
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

  async getAll(requestedUser: User): Promise<UserDTO[]> {
    const users = await this.userRepo.findAll();
  
    const usersWithSubscription = await Promise.all(
      users.map((user) => this.attatchUserSubscription(user))
    );
  
    const withoutRequestedUser = usersWithSubscription.filter(
      (user) => user.id !== requestedUser.id
    );
  
    return withoutRequestedUser.map((user) => UserDTOSchema.parse(user));
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
   
    const isChatbot = user.roles.every(r => r.code === RoleCode.ASSISTANT);
    if (isChatbot) {
      throw new BadRequestResponseError("You can not delete chatbot");
    }
    const isAdminUser = user.roles.some((r) => r.code === RoleCode.ADMIN);
    if (isAdminUser) {
      const adminUsers = await this.userRepo.findUsersByRoles([RoleCode.ADMIN]);
      if (!adminUsers.length) {
        throw new BadRequestResponseError("At least one admin user must exist");
      }
    }

    await this.revokeUserTokens(user.id);
    return this.userRepo.softDeleteUser(user.id);
  }
  async getUserCountWithMonthlyGrowth(): Promise<{
    total: number;
    currentMonth: number;
    previousMonth: number;
    growthRate: number;
  }> {
    return this.userRepo.getUserCountWithMonthlyGrowth();
  }
  async getPaginatedUsers(
    requestedUser: User,
    queryParams: UserQueryParamsDTO
  ): Promise<PaginatedResponse<UserResponseDTO>> {
    const { items, total } = await this.userRepo.getPaginatedUsers(queryParams);
    const usersWithSubscription = await Promise.all(
      items.map((user) => this.attatchUserSubscription(user))
    );
    const withoutRequestedUser = usersWithSubscription.filter((user) => user.id !== requestedUser.id);
    const panigatedData = buildPaginatedResponse({
      items: withoutRequestedUser,
      meta: {
        total,
        limit: queryParams.limit,
        offset: queryParams.offset,
      },
    });
    return PaginatedResponseSchema(UserResponseDTOSchema).parse(panigatedData);
  }

  private async attatchUserSubscription(
    user: User
  ): Promise<User & { userSubscription: UserSubscription }> {
    const userSubscription =
      await this.userSubscriptionService.getActiveUserSubsription(user.id);
    if (!userSubscription) {
      throw new NotFoundResponseError("User subscription not found");
    }
    user.userSubscription = userSubscription;
    return user;
  }
  private async revokeUserTokens(userId: number): Promise<UpdateResult> {
    return this.userSessionRepo.update(
      { user: { id: userId } },
      { isRevoked: true }
    );
  }

}
