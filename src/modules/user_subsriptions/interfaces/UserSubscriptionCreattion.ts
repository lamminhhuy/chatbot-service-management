import { SubscriptionType } from "@/modules/subscription/enums/SubscriptionType";
import { SubscriptionCode } from "../../subscription/enums/SubscriptionCode";

export interface UserSubscriptionCreation {
    userId: number;
    subscriptionType: SubscriptionType;
    subscriptionId: number;
}