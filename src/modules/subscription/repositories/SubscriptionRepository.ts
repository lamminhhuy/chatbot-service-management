import { DataSource, Repository } from "typeorm";
import { Subscription } from "@/modules/subscription/models/Subscription";
import { injectable } from "tsyringe";
import { AppDataSource } from "@/database/PostgresDB";
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
        const subscription = await this.exists({where: {name}});
        return subscription;
    }

    async existsById(id: number): Promise<boolean> {
        const subscription = await this.exists({where: {id}});
        return subscription;
    }
    
    async findByCode(code: SubscriptionCode): Promise<Subscription | null> {
        const subscription = await this.findOneBy({code});
        return subscription;
    }
    
    async getAllActiveSubscription(): Promise<Subscription[]> {
        const subscriptions = await this.find({where: {isActive: true}});
        return subscriptions;
    }
    
    async softDeleteSubscription(id: number): Promise<DeleteResult> {
        const subscription = await this.findOneBy({id});
        if (!subscription) {
            throw new BadRequestResponseError("Subscription not found");
        }
        return this.softDelete(id);
    }
}  

export default SubscriptionRepository;