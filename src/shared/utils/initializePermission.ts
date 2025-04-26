import { AppDataSource } from "@/database/PostgresDB";
import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";
import {  extractResourcesAndAction } from "./extractResourcesAndAction";
import { Permission } from "@/modules/authorization/models/PermissionModel";

export const initializePermission = async (modules: ModuleConfig[]) => {

    const getName = (resources:string, action: string)=> {
      const resource = resources.endsWith('s') ? resources.slice(0, -1) : resources;
      return ` ${action}_${resource}`;
    };

    const getDescription = (resources:string, action: string)=> {
        const resource = resources.endsWith('s') ? resources.slice(0, -1) : resources;
        return ` ${action} ${resource}`;
     };
    
      const permissions =await AppDataSource.query('select * from permissions')
      const currentPems = new Set(permissions.map((p: Permission) => p.code))  
      const newPems : Permission[] = []
      modules.forEach(module => {
        module.routes.forEach(route => {
            if(route.isPublic) return
          const url = `${module.prefix}${route.path}`;
          const { resources, action } = extractResourcesAndAction(url, route.method);
          const formattedResource = resources.map(r => r.resource).join('.');
          const permissionCode = `${formattedResource}:${action}`;
          if (!currentPems.has(permissionCode)) {
            newPems.push(new Permission(getName(formattedResource, action || ''), permissionCode, getDescription(formattedResource, action || '')));
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
    
    
