import { registerInfraDependencies } from "./infrastructure/infra.container";
import { registerAuthDependencies } from "./modules/auth/auth.container";
import { registerChatbotDependencies } from "./modules/chatbot/chatbot.container";
import { registerConversationDependencies } from "./modules/conversation/conversation.container";
import { registerPaymentDependencies } from "./modules/payment/payment.container";
import { registerRoleDependencies } from "./modules/role/role.container";
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
}


