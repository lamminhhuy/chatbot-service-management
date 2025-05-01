

import { inject, injectable } from 'tsyringe';
import { BadRequestResponseError } from '@/shared/response/errors.response';
import { PermissionService } from '@/modules/authorization/services/PermissionService';
import { Role } from '@/modules/authorization/models/RoleModel';;
import { RoleCode } from '@/modules/user/enums/Role';
import { IRoleRepository } from '@/modules/user/interfaces/IRoleRepository';
@injectable()
export class RoleService {
  constructor(
    @inject('IRoleRepository') private readonly roleRepository: IRoleRepository, 
    @inject(PermissionService) private readonly permissionService: PermissionService
  ) {}

  async findRoleByCode(code: RoleCode): Promise<Role | null> {
    return this.roleRepository.findRoleByCode(code);
  }

  async findRolebyId(roleId: number): Promise<Role | null> {
      return this.roleRepository.findRoleById(roleId);
  }
  
  async assignPermission(roleId: number, permissionIds: number[]): Promise<Role> {
    const role = await this.findRolebyId(roleId);
    if (!role) throw new BadRequestResponseError('Role not found');
    const permissions = await this.permissionService.findPermissionByIds(permissionIds);
    const isPermissionIdsValid = permissions && permissions.length !== permissionIds.length;
    if (isPermissionIdsValid) {
      const foundIds = permissions.map(p => p.id);
      const missingIds = permissionIds.filter(id => !foundIds.includes(id));
      throw new BadRequestResponseError(`Permissions with IDs ${missingIds.join(', ')} not found`);
    }
    const newPermissions = permissions?.filter(p => !role.permissions.some(rp => rp.id === p.id));
    if (newPermissions) {
      role.permissions.push(...newPermissions);
    }
    const updatedRole = await this.roleRepository.save(role);
    return updatedRole;
  }
  
  async revokePermission(roleId: number, permissionIds: number[]): Promise<Role> {
    const role = await this.findRolebyId(roleId);
    if (!role) throw new BadRequestResponseError('Role not found');
    const permissions = await this.permissionService.findPermissionByIds(permissionIds);
    const isPermissionIdsValid = permissions && permissions.length !== permissionIds.length;
    if (isPermissionIdsValid) {
      const foundIds = permissions.map(p => p.id);
      const missingIds = permissionIds.filter(id => !foundIds.includes(id));
      throw new BadRequestResponseError(`Permissions with IDs ${missingIds.join(', ')} not found`);
    }
    const newPermissions = permissions?.filter(p => role.permissions.some(rp => rp.id === p.id));
    if (newPermissions) {
      role.permissions = newPermissions;
    }
    const updatedRole = await this.roleRepository.save(role);
    return updatedRole;
  }
}
