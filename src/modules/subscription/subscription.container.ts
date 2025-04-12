import { container } from "tsyringe"
import SubscriptionRepository from "./repositories/SubscriptionRepository"
import SubscriptionService from "./services/SubscriptionService"

export const registerSubscriptionDependencies = () => {
  container.register('ISubscriptionRepository', { useClass: SubscriptionRepository })
  container.register(SubscriptionService, { useClass: SubscriptionService })
}