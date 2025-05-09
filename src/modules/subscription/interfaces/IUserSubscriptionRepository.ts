import { SubscriptionCode } from "../enums/SubscriptionCode";
import { UserSubscription } from "../models/UserSubscription";

export interface IUserSubscriptionRepository {
createUserSubscription(userSubscription: UserSubscription): Promise<UserSubscription>,
findByCode(code: SubscriptionCode): Promise<UserSubscription | null>,
findActiveUserSubscription(userId: number): Promise<UserSubscription | null>,
getTotalUserSubscriptionWithGrowthFromLastMonth(): Promise<{total: number, currentMonth: number, previousMonth: number, growthRate: number}>
}  
