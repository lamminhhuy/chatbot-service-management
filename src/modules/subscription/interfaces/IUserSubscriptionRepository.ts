import { UserSubscription } from "../models/UserSubscription";

export interface IUserSubscriptionRepository {
create(userId: number, subscriptionId: number): Promise<UserSubscription>
}  
