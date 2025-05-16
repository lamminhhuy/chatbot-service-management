import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";
import { SubscriptionController } from "../controllers/SubscriptionController";
import { container } from "tsyringe";
import { CreateSubscriptionDTOSchema } from "../dtos/CreateSubscription.dto";
import { validateRequest } from "@/shared/middlewares/validateRequest/validateRequest";
import { UpdateSubscriptionDTOSchema } from "../dtos/UpdateSubscription.dto";


const subscriptionController = container.resolve(SubscriptionController);

export const subscriptionModule: ModuleConfig = {
  prefix: '/subscriptions',
  moduleName: 'subscription',
  routes: [
    {
      path: '/',
      method: 'GET',
      isPublic: true,
      handler: { controller: 'subscription',
                action:  subscriptionController.handleGetAll.bind(subscriptionController)}
    },
    {
      path: '/:id',
      method: 'GET',
      handler: { controller: 'subscription',
                action:  subscriptionController.handleGetOne.bind(subscriptionController)}
    },
    {
      path: '/',
      method: 'POST',
      middlewares: [validateRequest(CreateSubscriptionDTOSchema)],
      handler: { controller: 'subscription',
                action:  subscriptionController.handleCreate.bind(subscriptionController)}
    },
    {
      path: '/:id',
      method: 'PUT',
      middlewares: [validateRequest(UpdateSubscriptionDTOSchema)],
      handler: { controller: 'subscription',
                action:  subscriptionController.handleUpdate.bind(subscriptionController)}
    },
    {
      path: '/:id',
      method: 'PUT',
      middlewares: [validateRequest(UpdateSubscriptionDTOSchema)],
      handler: { controller: 'subscription',
                action:  subscriptionController.handleUpdate.bind(subscriptionController)}
    },
    {
      path: '/:id',
      method: 'PUT',
      middlewares: [validateRequest(UpdateSubscriptionDTOSchema)],
      handler: { controller: 'subscription',
                action:  subscriptionController.handleUpdate.bind(subscriptionController)}
    },
    {
      path: '/:id',
      method: 'DELETE',
      handler: { controller: 'subscription',
                action:  subscriptionController.handleDelete.bind(subscriptionController)}
    }
  ]
}