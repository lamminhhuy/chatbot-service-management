import "reflect-metadata";
import { IRoleRepository } from "@/modules/user/interfaces/IRoleRepository";
import { RoleService } from "../services/RoleService";
import { PermissionService } from "../services/PermissionService";
import { IPermissionRepository } from "../interfaces/IPermissionRepository";
import { vi} from 'vitest'
import { Role } from "../models/RoleModel";
import { Permission } from "../models/PermissionModel";
import { mock } from 'vitest-mock-extended'

describe('Authorization', () => {
   let roleService: RoleService; 
   let permissionService: PermissionService;
   let role: Role;
   let permission: Permission;
   const mockRoleRepository = mock<IRoleRepository>();
   const mockPermissionRepository = mock<IPermissionRepository>();

   beforeEach(()=> {
    permissionService = new PermissionService(mockPermissionRepository);
    roleService = new RoleService(mockRoleRepository,permissionService);
    role = {
        id: 1, name: 'admin',
        code: 'ADMIN',
        description: 'Admin role',
        createdAt: new Date(),
        updatedAt: new Date(),
        users: [],
        permissions: [],
        addPermission: vi.fn().mockImplementation((permission) => {
            role.permissions.push(permission)
        }),
        removePermission: vi.fn().mockImplementation((permission) => {
            role.permissions = role.permissions.filter(p => p.id !== permission.id);
        })
    }
    permission = {
        id: 0,
        name: "Create Subscription",
        code: "subscription:create",
        description: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        roles: []
    }
   })

   it('add permission', async () => {
  
    mockRoleRepository.findRoleById.mockResolvedValue(role)
    mockPermissionRepository.findPermissionById.mockResolvedValue(permission)

    await roleService.addPermission(1, 1)
    expect(mockRoleRepository.findRoleById).toHaveBeenCalledWith(1);
    expect(mockPermissionRepository.findPermissionById).toHaveBeenCalledWith(1);
    expect(role.addPermission).toHaveBeenCalledWith(permission);
    expect(role.permissions).toEqual([permission]); 
   })     
   
   it('remove permission'), async () => {
      role.permissions = [permission]
      mockRoleRepository.findRoleById.mockResolvedValue(role)
     mockPermissionRepository.findPermissionById.mockResolvedValue(permission)

    await roleService.removePermission(1, 1)
    expect(mockRoleRepository.findRoleById).toHaveBeenCalledWith(1);
    expect(mockPermissionRepository.findPermissionById).toHaveBeenCalledWith(1);
    expect(role.removePermission).toHaveBeenCalledWith(permission);
    expect(role.permissions).toEqual([]);
   }
})