import { registerInfraDependencies } from "./infrastructure/infra.container";
import { registerAuthDependencies } from "./modules/auth/auth.container";
import { registerChatbotDependencies } from "./modules/chatbot/chatbot.container";
import { registerConversationDependencies } from "./modules/conversation/conversation.container";
import { registerRoleDependencies } from "./modules/role/role.container";
import { registerSubscriptionDependencies } from "./modules/subscription/subscription.container";
import { registerUserDependencies } from "./modules/user/user.container";
import { registerUserSubscriptionDependencies } from "./modules/user_subsriptions/userSubscription.container";

export function setUpContainers (){
  registerInfraDependencies()
  registerRoleDependencies()
  registerUserDependencies()
  registerAuthDependencies()
  registerConversationDependencies()
  registerChatbotDependencies()
  registerSubscriptionDependencies()
  registerUserSubscriptionDependencies()
}

