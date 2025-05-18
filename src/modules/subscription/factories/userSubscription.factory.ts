import { injectable } from "tsyringe";
import { UserSubscription } from "../models/UserSubscription";
import { UserSubscriptionCreation } from "../interfaces/UserSubscriptionCreation";
import { SubscriptionType } from "@/modules/subscription/enums/SubscriptionType";
import dayjs from "dayjs";
import { SubscriptionCode } from "../enums/SubscriptionCode";

@injectable()
class UserSubscriptionFactory {


  public create(data: UserSubscriptionCreation): UserSubscription {

    const { endDate, renewalDate } = data.subscription.code === SubscriptionCode.BASIC ? { endDate: null, renewalDate: null } : { endDate: dayjs().add(1, "month").toDate(), renewalDate: dayjs().add(1, "month").toDate() };
    
    const subscription = new UserSubscription();
    subscription.userId = data.userId;
    subscription.subscription = data.subscription;
    subscription.endDate = endDate;
    subscription.renewalDate = renewalDate;
    return subscription;
  }
}
export default UserSubscriptionFactory;
