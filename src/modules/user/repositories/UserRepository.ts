import { Repository, In } from "typeorm";
import { User } from "../models/UserModel";
import { AppDataSource } from "@/database/PostgresDB";
import { IUserRepository } from "../interfaces/IUserRepository";
import { RoleCode } from "../enums/Role";
import { UserQueryParamsDTO } from "../dtos/UserQueryParamss.dto";

export class UserRepository extends Repository<User> implements IUserRepository {
  constructor() {
    if (!AppDataSource.isInitialized) {
      throw new Error("AppDataSource is not initialized");
    }
    super(User, AppDataSource.manager);
  }
  findUserById(id: number): Promise<User | null> {
    return this.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({
      where: { email },
      withDeleted: true,
      relations: ["roles"],
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.findOne({
      where: { id },
      relations: ["roles"],
    });
  }


  async isExistedByPhoneNumber(phoneNumber: string): Promise<boolean> {
    return this.existsBy({ phoneNumber });
  }

  async isExistedByEmail(email: string): Promise<boolean> {
    return this.existsBy({ email });
  }

  async findUsersByRoles(roleCodes: RoleCode[]): Promise<User[]> {
    return this.find({
      where: { roles: { code: In(roleCodes) } },
      relations: ["roles"],
    });
  }


  async getNewUsersFromLastMonthCount(): Promise<number> {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const queryBuilder = this.createQueryBuilder("user")
        .where("user.createdAt >= :startDate", { startDate: thirtyDaysAgo })
        .andWhere("user.createdAt <= :endDate", { endDate: new Date() });

      return await queryBuilder.getCount();
  }

  async softDeleteUser(id: number): Promise<void> {
    await this.softDelete({ id });
  }

  async restoreUser(id: number): Promise<void> {
    await this.restore({ id });
  }

  async getUserCountWithMonthlyGrowth(): Promise<{
    total: number;
    currentMonth: number;
    previousMonth: number;
    growthRate: number;
  }> {
    const now = new Date();
  
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  
    const [total, currentMonth, previousMonth] = await Promise.all([
      this.createQueryBuilder("user").getCount(),
      this.createQueryBuilder("user")
        .where("user.createdAt BETWEEN :start AND :end", {
          start: currentMonthStart,
          end: currentMonthEnd,
        })
        .getCount(),
      this.createQueryBuilder("user")
        .where("user.createdAt BETWEEN :start AND :end", {
          start: previousMonthStart,
          end: previousMonthEnd,
        })
        .getCount(),
    ]);
  
    const growthRate =
      previousMonth === 0
        ? currentMonth > 0 ? 100 : 0
        : ((currentMonth - previousMonth) / previousMonth) * 100;
  
    return {
      total,
      currentMonth,
      previousMonth,
      growthRate: parseFloat(growthRate.toFixed(2)),
    };
  }
  async getPaginatedUsers(queryParams: UserQueryParamsDTO): Promise<{items: User[], total: number}> {
    
    const queryBuilder = this.createQueryBuilder("user")
        .leftJoinAndSelect("user.roles", "role")
        .where("user.email != :email", { email: "chatbot@gmail.com" })
        .skip(queryParams.offset)
        .take(queryParams.limit);

    if (queryParams.search) {
        queryBuilder.andWhere("user.username ILIKE :search", { search: `%${queryParams.search}%` });
    }

    const [items, total] = await queryBuilder.getManyAndCount();

    return { items, total };
}

async findAll(): Promise<User[]> {
    return this.createQueryBuilder("user")
        .leftJoinAndSelect("user.roles", "role")
        .where("user.email != :email", { email: "chatbot@gmail.com" })
        .getMany();
}

async saveOrReplaceSoftDeletedUser(newUser: User): Promise<User> {
  const existingSoftDeleted = await this.createQueryBuilder("user")
    .withDeleted()
    .where("user.email = :email", { email: newUser.email })
    .andWhere("user.deletedAt IS NOT NULL")
    .getOne();

  if (existingSoftDeleted) {
    await this.remove(existingSoftDeleted);
  }

  const created = this.create(newUser);
  return await this.save(created);
}

async restoreAndUpdateSoftDeletedUser(data: User): Promise<User> {
  const existingSoftDeleted = await this.createQueryBuilder("user")
    .withDeleted()
    .where("user.email = :email", { email: data.email })
    .andWhere("user.deletedAt IS NOT NULL")
    .getOne();

  if (existingSoftDeleted) {
    await this.restore(existingSoftDeleted.id);
    Object.assign(existingSoftDeleted, data);
    return await this.save(existingSoftDeleted);
  }
  const newUser = this.create(data);
  return await this.save(newUser);
}
 
}