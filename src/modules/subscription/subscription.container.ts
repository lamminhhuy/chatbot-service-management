import { container } from "tsyringe"
import SubscriptionRepository from "./repositories/SubscriptionRepository"
import SubscriptionService from "./services/SubscriptionService"
import UserSubscriptionRepository from "./repositories/UserSubscriptionRepository"
import UserSubscriptionService from "./services/UserSubscriptionService"

export const registerSubscriptionDependencies = () => {
  container.register('ISubscriptionRepository', { useClass: SubscriptionRepository })
  container.register(SubscriptionService, { useClass: SubscriptionService })
  container.register('IUserSubscriptionRepository', { useClass: UserSubscriptionRepository })
  container.register(UserSubscriptionService, { useClass: UserSubscriptionService })
}