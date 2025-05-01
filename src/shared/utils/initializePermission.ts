import { AppDataSource } from "@/database/PostgresDB";
import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";
import { Permission } from "@/modules/authorization/models/PermissionModel";
import { PermissionFormatter } from "./PermissionFormatter";


export const initializePermission = async (modules: ModuleConfig[]) => {

      const permissions =await AppDataSource.query('select * from permissions')
      const currentPems = new Set(permissions.map((p: Permission) => p.code)) 
      const newPems : Permission[] = []
      modules.forEach(module => {
        module.routes.forEach(route => {
            if(route.isPublic) return
          const scope = PermissionFormatter.formatScope(module.prefix);
          const controller =route.handler.controller;
          const action = route.handler.action;
          if(!controller) {
            throw Error('Controller not found');
          }
          if(!action) {
            throw Error('Action not found');
          }
           
          const actionName = PermissionFormatter.formatAction(action.name);
          const permissionCode = PermissionFormatter.getPermissionCode(scope,controller, actionName);
          if (!currentPems.has(permissionCode)) {
            newPems.push(new Permission(PermissionFormatter.getName(scope, actionName), permissionCode, PermissionFormatter.getDescription(scope, actionName || '')));
          }
        })
      })

      if (newPems.length > 0) {
        await AppDataSource.createQueryBuilder()
          .insert() 
          .into(Permission)
          .values(newPems.map(p => ({ code: p.code, name: p.name, description: p.description })))
          .execute()
      }
}