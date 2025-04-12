import { DataSource, Repository } from "typeorm";
import { Subscription } from "@/modules/subscription/models/Subscription";
import { injectable } from "tsyringe";
import { AppDataSource } from "@/database/PostgresDB";
import { ISubscriptionRepository } from "../interfaces/ISubscriptionRepository";

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
    
}

export default SubscriptionRepository;