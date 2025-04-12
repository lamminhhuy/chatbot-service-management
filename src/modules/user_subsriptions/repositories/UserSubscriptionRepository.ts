import { DataSource, Repository } from "typeorm";
import { Subscription } from "@/modules/subscription/models/Subscription";
import { injectable } from "tsyringe";
import { AppDataSource } from "@/database/PostgresDB";
import { IUserSubscriptionRepository } from "../interfaces/IUserSubscriptionRepository";
import { UserSubscription } from "../models/UserSubscription";
import { SubscriptionCode } from "../../subscription/enums/SubscriptionCode";

@injectable()
class UserSubscriptionRepository extends Repository<UserSubscription> implements IUserSubscriptionRepository {
    constructor() {
        super(UserSubscription, AppDataSource.manager);
    }
    async createUserSubscription(userSubscription: UserSubscription): Promise<UserSubscription> {
        return await this.save(userSubscription);
    }
    
    async findByCode(code: SubscriptionCode): Promise<UserSubscription | null> {
        return await this.findOne({ where: { subscription: { code } } });
    }

    async findActiveUserSubscription(userId: number): Promise<UserSubscription | null> {
        return await this.findOne({ where: {user: {id: userId}}});
    }
    
}

export default UserSubscriptionRepository;