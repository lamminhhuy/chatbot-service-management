import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";

export const authorizationModule: ModuleConfig = {
  prefix: '/authorization',
  routes: [
    {
      method: 'POST',
      path: '/roles',
      handler: RoleController.addPermission
    }
  ]
}