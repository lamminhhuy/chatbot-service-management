import { DataSource, IsNull, Repository } from "typeorm";
import { Subscription } from "@/modules/subscription/models/Subscription";
import { injectable } from "tsyringe";
import { AppDataSource } from "@/database/PostgresDB";
import { IUserSubscriptionRepository } from "../interfaces/IUserSubscriptionRepository";
import { UserSubscription } from "../models/UserSubscription";
import { SubscriptionCode } from "../enums/SubscriptionCode";
import { SubscriptionStatus } from "../enums/SubscriptionStatus";

@injectable()
class UserSubscriptionRepository extends Repository<UserSubscription> implements IUserSubscriptionRepository {
    constructor() {
        super(UserSubscription, AppDataSource.manager);
    }

    async createUserSubscription(userSubscription: UserSubscription): Promise<UserSubscription> {
        await this.createQueryBuilder()
            .update(UserSubscription)
            .set({ status: SubscriptionStatus.CANCELLED })
            .where("user_subscriptions.user_id = :userId", { userId: userSubscription.userId })
            .andWhere("user_subscriptions.status = :status", { status: SubscriptionStatus.ACTIVE })
            .execute();

        return await this.save(userSubscription);
    }

    async findByCode(code: SubscriptionCode): Promise<UserSubscription | null> {
        return await this.findOne({ where: { subscription: { code } } });
    }

    async findActiveUserSubscription(userId: number): Promise<UserSubscription | null> {
        return await this.findOne({ where: { user: { id: userId }, status: SubscriptionStatus.ACTIVE } });
    }

    async hasActiveUsersForSubscription(subscriptionId: number): Promise<boolean> {
        const count = await this.count({ where: { subscription: { id: subscriptionId }, status: SubscriptionStatus.ACTIVE, user: { deletedAt: IsNull() } } });
        return count > 0;
    }

    async getTotalUserSubscriptionWithGrowthFromLastMonth(): Promise<{
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

        const [totalResult, currentResult, previousResult] = await Promise.all([
            this.createQueryBuilder('user_subscription')
                .select('COUNT(*)', 'count')
                .where('user_subscription.status = :status', { status: SubscriptionStatus.ACTIVE })
                .getRawOne(),

            this.createQueryBuilder('user_subscription')
                .select('COUNT(*)', 'count')
                .where('user_subscription.status = :status', { status: SubscriptionStatus.ACTIVE })
                .andWhere('user_subscription.created_at BETWEEN :start AND :end', {
                    start: currentMonthStart,
                    end: currentMonthEnd,
                })
                .getRawOne(),

            this.createQueryBuilder('user_subscription')
                .select('COUNT(*)', 'count')
                .where('user_subscription.status = :status', { status: SubscriptionStatus.ACTIVE })
                .andWhere('user_subscription.created_at BETWEEN :start AND :end', {
                    start: previousMonthStart,
                    end: previousMonthEnd,
                })
                .getRawOne(),
        ]);

        const total = Number(totalResult?.count ?? 0);
        const currentMonth = Number(currentResult?.count ?? 0);
        const previousMonth = Number(previousResult?.count ?? 0);

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
}

export default UserSubscriptionRepository;