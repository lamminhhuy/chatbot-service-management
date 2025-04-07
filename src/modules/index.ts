import { authModule } from "./auth/routes/authRoutes";
import { chatModule } from "./chatbot/routes/chatRoutes";
import { conversationModule } from "./conversation/routes/conversationRoutes";
import { userModule } from "./user/routes/userRoutes";

export default [authModule, chatModule, conversationModule, userModule];
