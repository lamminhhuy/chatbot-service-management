import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";
import { SubscriptionController } from "../controllers/UserSubscriptionController";
import { container } from "tsyringe";
import { CreateSubscriptionDTOSchema } from "../dtos/CreateSubscription.dto";
import { validateRequest } from "@/shared/middlewares/validateRequest/validateRequest";
import { UpdateSubscriptionDTOSchema } from "../dtos/UpdateSubscription.dto";


const subscriptionController = container.resolve(SubscriptionController);

export const userSubscriptionModule: ModuleConfig = {
  prefix: '/subscriptions',
  routes: [
  
  ]
}