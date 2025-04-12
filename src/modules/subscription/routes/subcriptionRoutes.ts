import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";
import { SubscriptionController } from "../controllers/SubscriptionController";
import { container } from "tsyringe";
import { CreateSubscriptionDTOSchema } from "../dtos/CreateSubscription.dto";
import { validateRequest } from "@/shared/middlewares/validateRequest/validateRequest";
import { UpdateSubscriptionDTOSchema } from "../dtos/UpdateSubscription.dto";


const subscriptionController = container.resolve(SubscriptionController);

export const subscriptionModule: ModuleConfig = {
  prefix: '/subscriptions',
  routes: [
    {
      path: '/',
      method: 'get',
      handler: subscriptionController.handleGetAll.bind(subscriptionController)
    },
    {
      path: '/:id',
      method: 'get',
      handler: subscriptionController.handleGetOne.bind(subscriptionController)
    },
    {
      path: '/',
      method: 'post',
      middlewares: [validateRequest(CreateSubscriptionDTOSchema)],
      handler: subscriptionController.handleCreate.bind(subscriptionController)
    },
    {
      path: '/:id',
      method: 'put',
      middlewares: [validateRequest(UpdateSubscriptionDTOSchema)],
      handler: subscriptionController.handleUpdate.bind(subscriptionController)
    },
    {
      path: '/:id',
      method: 'delete',
      handler: subscriptionController.handleDelete.bind(subscriptionController)
    }
  ]
}