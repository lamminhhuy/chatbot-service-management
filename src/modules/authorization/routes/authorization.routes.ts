import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";
import RoleController from "../controllers/RoleController";
import { container } from "tsyringe";
import { AssignPermissionDTOSchema, RevokePermissionDTOSchema } from "../dtos/AssignPermission.dto";
import { CreateRoleDTOSchema } from "../dtos/CreateRole.dto";
import { UpdateRoleDTOSchema } from "../dtos/UpdateRole.dto";
import { validateRequest } from "@/shared/middlewares/validateRequest/validateRequest";


const roleController = container.resolve(RoleController) 
export const authorizationModule: ModuleConfig = {
  prefix: '/roles',
  moduleName: 'authorization',
  routes: [
    {
      method: 'GET',
      path: '/permissions',
      handler: { controller: 'authorization',
                action:  roleController.handleGetAllPermission.bind(roleController)}
    },
    {
      method: 'POST',
      path: '/:roleId/permissions',
      handler: { controller: 'authorization',
                action:  roleController.handleAssignPermissions.bind(roleController)},
      middlewares: [validateRequest(AssignPermissionDTOSchema)]
    },
    {
      method: 'POST',
      path: '/:roleId/permissions/revoke',
      handler: { controller: 'authorization',
                action:  roleController.handleRevokePermission.bind(roleController)},
      middlewares: [validateRequest(RevokePermissionDTOSchema)]
    },
    {
      method: 'GET',
      path: '/',
      handler: { controller: 'authorization',
                action:  roleController.handleGetAllRoles.bind(roleController)}
    },
    {
      method: 'DELETE',
      path: '/:roleId',
      handler: { controller: 'authorization',
                action:  roleController.handleDeleteRole.bind(roleController)}
    },
    {
      method: 'PUT',
      path: '/:roleId',
      handler: { controller: 'authorization',
                action:  roleController.handleUpdateRole.bind(roleController)},
      middlewares: [validateRequest(UpdateRoleDTOSchema)]
    },
    {
      method: 'POST',
      path: '/',
      handler: { controller: 'authorization',
                action:  roleController.handleCreateRole.bind(roleController)},
      middlewares: [validateRequest(CreateRoleDTOSchema)]
    },
    {
      method: 'GET',
      path: '/:roleId/permissions',
      handler: { controller: 'authorization',
                action:  roleController.handleGetAllPermissionByRoleId.bind(roleController)}
    }
  ]
}