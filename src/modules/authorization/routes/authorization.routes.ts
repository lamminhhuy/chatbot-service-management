import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";
import RoleController from "../controllers/RoleController";
import { container } from "tsyringe";


const roleController = container.resolve(RoleController) 
export const authorizationModule: ModuleConfig = {
  prefix: '/roles',
  moduleName: 'authorization',
  routes: [
    {
      method: 'POST',
      path: '/:roleId/permissions',
      handler: { controller: 'authorization',
                action:  roleController.handleAssignPermissions.bind(roleController)}
    }
  ]
}