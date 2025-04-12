import { inject, injectable } from "tsyringe";
import { IUserSubscriptionRepository } from "../interfaces/IUserSubscriptionRepository";

@injectable()
class UserSubscriptionService {
    constructor(@inject('IUserSubscriptionRepository') private userSubscriptionRepository: IUserSubscriptionRepository) {}
    createSubscription() {
           
    }
}
