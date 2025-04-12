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
    const { endDate, renewalDate } = this.subscriptionTypeMapper.get(data.subscriptionType) ?? { endDate: null, renewalDate: null };
    
    return new UserSubscription({
      userId: data.userId,
      subscriptionId: data.subscriptionId,
      endDate,
      renewalDate,
    });
  }

}

export default UserSubscriptionFactory;
