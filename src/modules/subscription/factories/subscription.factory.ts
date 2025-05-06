import { inject, injectable } from "tsyringe";
import { CreateSubscriptionDTO } from "../dtos/CreateSubscription.dto";
import { Subscription } from "../models/Subscription";
import { formatCode } from "../utils/formatCode";
import { BillingCycle } from "../enums/BillingCycle";

@injectable()
class SubscriptionFactory {

  public create(data: CreateSubscriptionDTO): Subscription{
    return new Subscription(data.name, formatCode(data.name), data.price, BillingCycle.MONTHLY, data.queryTokenLimit, data.description, data.metadata);
  }
}

export default SubscriptionFactory;