import { injectable } from "tsyringe";
import { UserSubscription } from "../models/UserSubscription";
import { UserSubscriptionCreation } from "../interfaces/UserSubscriptionCreation";
import { SubscriptionType } from "@/modules/subscription/enums/SubscriptionType";
import dayjs from "dayjs";

@injectable()
class UserSubscriptionFactory {
  
  private readonly subscriptionTypeMapper = new Map<SubscriptionType, { endDate: Date | null; renewalDate: Date | null }>(
    [
      [SubscriptionType.STANDARD, { endDate: dayjs().add(1, "month").toDate(), renewalDate: dayjs().add(1, "month").toDate() }],
      [SubscriptionType.PREMIUM, { endDate: dayjs().add(1, "year").toDate(), renewalDate: dayjs().add(1, "year").toDate() }],
    ]
  );

  public create(data: UserSubscriptionCreation): UserSubscription {

    const { endDate, renewalDate } = this.subscriptionTypeMapper.get(data.subscription.type) ?? { endDate: null, renewalDate: null };
    
    const subscription = new UserSubscription();
    subscription.userId = data.userId;
    subscription.subscription = data.subscription;
    subscription.endDate = endDate;
    subscription.renewalDate = renewalDate;
    return subscription;
  }
}
export default UserSubscriptionFactory;
