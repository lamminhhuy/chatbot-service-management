import { SubscriptionCode } from "../../subscription/enums/SubscriptionCode";
import { UserSubscription } from "../models/UserSubscription";

export interface IUserSubscriptionRepository {
createUserSubscription(userSubscription: UserSubscription): Promise<UserSubscription>,
findByCode(code: SubscriptionCode): Promise<UserSubscription | null>,
findActiveUserSubscription(userId: number): Promise<UserSubscription | null>,
}  
