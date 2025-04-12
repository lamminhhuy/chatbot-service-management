import { SubscriptionPlanCode } from "../enums/SubscriptionCode";

export interface CreateSubscriptionDTO {
    userId: number;
    SubscriptionPlanCode: SubscriptionPlanCode;
}