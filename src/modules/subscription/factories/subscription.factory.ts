import { inject, injectable } from "tsyringe";
import { CreateSubscriptionDTO } from "../dtos/CreateSubscription.dto";
import { Subscription } from "../models/Subscription";
import { formatCode } from "../utils/formatCode";
import { BillingCycle } from "../enums/BillingCycle";

@injectable()
class SubscriptionFactory {

  public create(data: CreateSubscriptionDTO): Subscription{
    const subscription = new Subscription();
    subscription.name = data.name;
    subscription.code = formatCode(data.name);
    subscription.price = data.price;
    subscription.billingCycle = BillingCycle.MONTHLY;
    subscription.description = data.description;
    subscription.metadata = data.metadata;
    subscription.queryTokenLimit = data.queryTokenLimit;
    subscription.canChatWithAgent = data.canChatWithAgent;

    return subscription;
  }
}

export default SubscriptionFactory;