import { container } from "tsyringe"
import UserSubscriptionRepository from "./repositories/UserSubscriptionRepository"
import UserSubscriptionService from "./services/UserSubscriptionService"

export const registerUserSubscriptionDependencies = () => {
  container.register('IUserSubscriptionRepository', { useClass: UserSubscriptionRepository })
  container.register(UserSubscriptionService, { useClass: UserSubscriptionService })
}