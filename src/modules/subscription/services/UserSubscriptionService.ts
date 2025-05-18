import { inject, injectable } from "tsyringe";
import { Transactional } from "typeorm-transactional";
import { IUserSubscriptionRepository } from "../interfaces/IUserSubscriptionRepository";
import { UserSubscription } from "../models/UserSubscription";
import UserSubscriptionFactory from "../factories/userSubscription.factory";
import { CreateUserSubscriptionDTO } from "../interfaces/CreateUserSubscription.dto";
import SubscriptionService from "@/modules/subscription/services/SubscriptionService";
import { ErrorsResponse } from "@/shared/response/errors.response";
import { IUserRepository } from "@/modules/user/interfaces/IUserRepository";
import { SubscriptionCode } from "../enums/SubscriptionCode";

@injectable()
class UserSubscriptionService {
  constructor(
    @inject("IUserSubscriptionRepository")
    private userSubscriptionRepository: IUserSubscriptionRepository,
    @inject(UserSubscriptionFactory)
    private userSubscriptionFactory: UserSubscriptionFactory,
    @inject(SubscriptionService)
    private subscriptionService: SubscriptionService,
    @inject("IUserRepository")
    private userRepository: IUserRepository
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
    const result =await this.userSubscriptionRepository.findActiveUserSubscription(userId);
    if(!result){
      const basicSubscription = await this.subscriptionService.findByCode(SubscriptionCode.BASIC);
      if(!basicSubscription){
        throw new ErrorsResponse("Basic subscription not found", 408);
      }
    const userSubscription = this.userSubscriptionFactory.create({
      userId: userId,
      subscription: basicSubscription,
    });
   const createdUserSubscription = await this.userSubscriptionRepository.createUserSubscription(userSubscription);
    return createdUserSubscription;
  }
  return result;
  }
  async getTotalUserSubscriptionWithGrowthFromLastMonth(): Promise<{total: number, currentMonth: number, previousMonth: number, growthRate: number}> {
    return this.userSubscriptionRepository.getTotalUserSubscriptionWithGrowthFromLastMonth();
  }
  async hasActiveUsersForSubscription(subscriptionId: number): Promise<boolean> {
    return this.userSubscriptionRepository.hasActiveUsersForSubscription(subscriptionId);
  }
  async changeSubscription(userId: number, subscriptionId: number): Promise<UserSubscription> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new ErrorsResponse("User not found", 408);
    }
    const subscription = await this.subscriptionService.findById(subscriptionId);
    if (!subscription) {
      throw new ErrorsResponse("Subscription not found", 408);
    }
    const userSubscription = this.userSubscriptionFactory.create({
      userId: user.id,
      subscription,
    });
    await this.userSubscriptionRepository.createUserSubscription(userSubscription);
    return userSubscription;
  }
}

export default UserSubscriptionService;
