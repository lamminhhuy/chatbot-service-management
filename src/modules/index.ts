import { authModule } from "./auth/routes/authRoutes";
import { chatModule } from "./chatbot/routes/chatRoutes";
import { conversationModule } from "./conversation/routes/conversationRoutes";
import { subscriptionModule } from "./subscription/routes/subcriptionRoutes";
import { userModule } from "./user/routes/userRoutes";
import PaymentModule from "./payment/routes/paymentRoutes";
import { mediaModule } from "./media/routes/media.routes";
import { postModule } from "./post/routes/post.routes";

export default [authModule, chatModule, conversationModule, userModule,subscriptionModule, PaymentModule, mediaModule, postModule];
