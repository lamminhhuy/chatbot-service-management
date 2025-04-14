import { authModule } from "./auth/routes/authRoutes";
import { chatModule } from "./chatbot/routes/chatRoutes";
import { conversationModule } from "./conversation/routes/conversationRoutes";
import { subscriptionModule } from "./subscription/routes/subcriptionRoutes";
import { userModule } from "./user/routes/userRoutes";
import PaymentModule from "./payment/routes/paymentRoutes";

export default [authModule, chatModule, conversationModule, userModule,subscriptionModule, PaymentModule];
