import { registerInfraDependencies } from "./infrastructure/infra.container";
import { registerAuthDependencies } from "./modules/auth/auth.container";
import { registerRoleDependencies } from "./modules/authorization/authorization.container";
import { registerChatbotDependencies } from "./modules/chatbot/chatbot.container";
import { registerConversationDependencies } from "./modules/conversation/conversation.container";
import { registerMediaContainer } from "./modules/media/media.container";
import { registerPaymentDependencies } from "./modules/payment/payment.container";
import { registerPostDependencies } from "./modules/post/post.container";
import { registerSubscriptionDependencies } from "./modules/subscription/subscription.container";
import { registerUserDependencies } from "./modules/user/user.container";

export function setUpContainers (){
  registerInfraDependencies()
  registerRoleDependencies()
  registerUserDependencies()
  registerAuthDependencies()
  registerConversationDependencies()
  registerChatbotDependencies()
  registerSubscriptionDependencies()
  registerPaymentDependencies()
  registerMediaContainer()
  registerPostDependencies()
}


