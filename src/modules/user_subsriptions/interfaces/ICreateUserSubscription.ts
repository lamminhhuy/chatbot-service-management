import { SubscriptionCode } from "../../subscription/enums/SubscriptionCode";

export interface ICreateUserSubscriptionDTO {
  userId: number;
  subscriptionCode: SubscriptionCode;
}