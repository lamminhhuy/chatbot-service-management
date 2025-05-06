import { inject, injectable } from "tsyringe";
import { Transactional } from "typeorm-transactional";
import { IUserSubscriptionRepository } from "../interfaces/IUserSubscriptionRepository";
import { UserSubscription } from "../models/UserSubscription";
import UserSubscriptionFactory from "../factories/userSubscription.factory";
import { CreateUserSubscriptionDTO } from "../interfaces/CreateUserSubscription.dto";
import SubscriptionService from "@/modules/subscription/services/SubscriptionService";
import { ErrorsResponse } from "@/shared/response/errors.response";

@injectable()
class UserSubscriptionService {
  constructor(
    @inject("IUserSubscriptionRepository")
    private userSubscriptionRepository: IUserSubscriptionRepository,
    @inject(UserSubscriptionFactory)
    private userSubscriptionFactory: UserSubscriptionFactory,
    @inject(SubscriptionService)
    private subscriptionService: SubscriptionService
  ) {}

  async create(payload: CreateUserSubscriptionDTO): Promise<UserSubscription> {
    const subscription = await this.subscriptionService.findById(
      payload.subscriptionId
    );
    if (!subscription) {
      throw new ErrorsResponse("Subscription not found", 408);
    }

    const userSubscription = this.userSubscriptionFactory.create({
      userId: payload.userId,
      subscription,
    });

    return this.userSubscriptionRepository.createUserSubscription(
      userSubscription
    );
  }

  async getActiveUserSubsription(
    userId: number
  ): Promise<UserSubscription | null> {
    return this.userSubscriptionRepository.findActiveUserSubscription(userId);
  }
}

export default UserSubscriptionService;
