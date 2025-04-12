import { inject, injectable } from "tsyringe";
import { CreateSubscriptionDTO } from "../dtos/CreateSubscription.dto";
import { Subscription } from "../models/Subscription";

@injectable()
class SubscriptionFactory {
    private formatCode(name: string) {
      return name.split(' ').map(word => word.toUpperCase()).join('_');
    }
 
  public create(data: CreateSubscriptionDTO): Subscription{
    return new Subscription(data.name, this.formatCode(data.name), data.price, data.billingCycle, data.description, data.metadata, data.queryTokenLimit);
  }
}

export default SubscriptionFactory;