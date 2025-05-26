import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";
import { SubscriptionController } from "../controllers/SubscriptionController";
import { container } from "tsyringe";
import { CreateSubscriptionDTOSchema } from "../dtos/CreateSubscription.dto";
import { validateRequest } from "@/shared/middlewares/validateRequest/validateRequest";
import { UpdateSubscriptionDTOSchema } from "../dtos/UpdateSubscription.dto";
import { requireAuthorization } from "@/shared/middlewares/authorization/authorization.middleware";
import { RoleCode } from "@/modules/user/enums/Role";


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
                action:  subscriptionController.handleGetOne.bind(subscriptionController)},
      middlewares: [requireAuthorization([RoleCode.ADMIN,RoleCode.MANAGER])]
    },
    {
      path: '/',
      method: 'POST',
      handler: { controller: 'subscription',
                action:  subscriptionController.handleCreate.bind(subscriptionController)},
      middlewares: [ requireAuthorization([RoleCode.ADMIN,RoleCode.MANAGER]), validateRequest(CreateSubscriptionDTOSchema)],
    },
    {
      path: '/:id',
      method: 'PUT',
      handler: { controller: 'subscription',
                action:  subscriptionController.handleUpdate.bind(subscriptionController)},
      middlewares: [ requireAuthorization([RoleCode.ADMIN,RoleCode.MANAGER]), validateRequest(UpdateSubscriptionDTOSchema)],
    },
    {
      path: '/:id',
      method: 'DELETE',
      handler: { controller: 'subscription',
                action:  subscriptionController.handleDelete.bind(subscriptionController)},
      middlewares: [requireAuthorization([RoleCode.ADMIN,RoleCode.MANAGER])]
    }
  ]
}