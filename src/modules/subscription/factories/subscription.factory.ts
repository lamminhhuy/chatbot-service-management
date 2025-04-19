import { inject, injectable } from "tsyringe";
import { CreateSubscriptionDTO } from "../dtos/CreateSubscription.dto";
import { Subscription } from "../models/Subscription";
import { formatCode } from "../utils/formatCode";

@injectable()
class SubscriptionFactory {

  public create(data: CreateSubscriptionDTO): Subscription{
    return new Subscription(data.name, formatCode(data.name), data.price, data.billingCycle, data.queryTokenLimit, data.description, data.metadata);
  }
}

export default SubscriptionFactory;