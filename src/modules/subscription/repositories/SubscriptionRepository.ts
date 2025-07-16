import { DataSource, Repository } from "typeorm";
import { Subscription } from "@/modules/subscription/models/Subscription";
import { injectable } from "tsyringe";
import { AppDataSource } from "@/shared/infrastructure/database/PostgresDB";
import { ISubscriptionRepository } from "../interfaces/ISubscriptionRepository";
import { SubscriptionCode } from "@/modules/subscription/enums/SubscriptionCode";
import { BadRequestResponseError } from "@/shared/response/errors.response";
import { DeleteResult } from "typeorm";

@injectable()
class SubscriptionRepository extends Repository<Subscription> implements ISubscriptionRepository {
    constructor() {
        super(Subscription, AppDataSource.manager);
    }

    async existsByName(name: string): Promise<boolean> {
        const subscription = await this.exists({ where: { name } });
        return subscription;
    }

    async existsById(id: number): Promise<boolean> {
        const subscription = await this.exists({ where: { id } });
        return subscription;
    }
    
    async findByCode(code: SubscriptionCode): Promise<Subscription | null> {
        const subscription = await this.findOneBy({ code });
        return subscription;
    }
    
    async getAllActiveSubscription(): Promise<Subscription[]> {
        const subscriptions = await this.createQueryBuilder('subscription')
            .where('subscription.isActive = :isActive', { isActive: true })
            .orderBy(`CASE WHEN subscription.code = :basicPlan THEN 0 ELSE 1 END`, 'ASC')
            .setParameter('basicPlan', SubscriptionCode.BASIC)
            .getMany();
        
        return subscriptions;
    }
    
    async softDeleteSubscription(id: number): Promise<DeleteResult> {
        const subscription = await this.findOneBy({ id });
        if (!subscription) {
            throw new BadRequestResponseError("Subscription not found");
        }
        return this.softDelete(id);
    }
}  

export default SubscriptionRepository;