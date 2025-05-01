import { Subscription } from "../models/Subscription";

export interface UserSubscriptionCreation {
    userId: number;
    subscription: Subscription
}