import { container } from "tsyringe"
import SubscriptionRepository from "./repositories/SubscriptionRepository"
import SubscriptionService from "./services/SubscriptionService"
import UserSubscriptionRepository from "./repositories/UserSubscriptionRepository"
import UserSubscriptionService from "./services/UserSubscriptionService"
import { UserTokenLimiter } from "../conversation/services/QueryTokenLimiter"
import RedisClient from "@/database/redisClient"
import { ITokenConfig } from "@/modules/conversation/interfaces/ITokenConfig";
const defaultTokenConfig: ITokenConfig = {
    tokenExpireTime: 3600,
    tokenKeyPrefix: 'chatbot:token'
};
export const registerSubscriptionDependencies = () => {
  container.register('ISubscriptionRepository', { useClass: SubscriptionRepository })
  container.register(SubscriptionService, { useClass: SubscriptionService })
  container.register('IUserSubscriptionRepository', { useClass: UserSubscriptionRepository })
  container.register(UserSubscriptionService, { useClass: UserSubscriptionService })
  container.register('ITokenLimiter', {useValue: new UserTokenLimiter(RedisClient.getInstance(), defaultTokenConfig, container.resolve(UserSubscriptionService))})
}