import { inject, injectable } from "tsyringe";
import { IUserSubscriptionRepository } from "../interfaces/IUserSubscriptionRepository";
import { UserSubscription } from "../models/UserSubscription";
import UserSubscriptionFactory from "../factories/subscription.factory";
import { ICreateUserSubscriptionDTO } from "../interfaces/ICreateUserSubscription";
import SubscriptionService from "@/modules/subscription/services/SubscriptionService";
import { ErrorsResponse } from "@/shared/response/errors.response";

@injectable()
class UserSubscriptionService {
  constructor(
    @inject("IUserSubscriptionRepository")
    private userSubscriptionRepository: IUserSubscriptionRepository,
    @inject(UserSubscriptionFactory) private userSubscriptionFactory: UserSubscriptionFactory,
    @inject(SubscriptionService) private subscriptionService: SubscriptionService,
  ) {}
 
  async create(payload: ICreateUserSubscriptionDTO) {
  const subscription = await this.subscriptionService.findByCode(payload.subscriptionCode);
  if(!subscription)
  {
    throw new ErrorsResponse("Subscription not found",408);
  }
const userSubscription = this.userSubscriptionFactory.create({
userId: payload.userId,
subscriptionId: subscription.id,
subscriptionType: subscription.type,
});

return this.userSubscriptionRepository.createUserSubscription(userSubscription);
}

  async getActiveUserSubsription(userId: number): Promise<UserSubscription | null> {
    return await this.userSubscriptionRepository.findActiveUserSubscription(userId);
  }
}

export default UserSubscriptionService;
