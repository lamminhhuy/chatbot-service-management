
import { RoleCode } from '@/modules/user/enums/Role';
import { IRoleRepository } from '@/modules/user/interfaces/IRoleRepository';
import { inject, injectable } from 'tsyringe';
import { Role } from '../models/RoleModel';
import { CreateRoleDTO } from '../dtos/CreateRole.dto';
import { PermissionService } from './PermissionService';
import { BadRequestResponseError } from '@/shared/response/errors.response';
@injectable()
export class RoleService {
  constructor(
   @inject('IRoleRepository') private readonly roleRepository: IRoleRepository, 
   @inject('PermissionService') private readonly permissionService: PermissionService
  ) {}

  async findRoleByCode(code: RoleCode): Promise<Role | null> {
    return this.roleRepository.findRoleByCode(code);
  }

  async createRole(roleData: CreateRoleDTO): Promise<Role> {
    const newRole =  Role.createRole(roleData)
    return this.roleRepository.save(newRole);
  }

  async addPermission(roleId: number, permissionId: number): Promise<Role> {
    const role = await  this.roleRepository.findRoleById(roleId);
    if(!role) throw new BadRequestResponseError('Role not found');
    const permission = await this.permissionService.findPermissionById(permissionId);
    if(!permission) throw new BadRequestResponseError('Permission not found');
    role.addPermission(permission);
    const updatedRole = await this.roleRepository.save(role);
    return updatedRole;
  }

  async removePermission(roleId: number, permissionId: number): Promise<Role> {
    const role = await  this.roleRepository.findRoleById(roleId);
    if(!role) throw new BadRequestResponseError('Role not found');
    const permission = await this.permissionService.findPermissionById(permissionId);
    if(!permission) throw new BadRequestResponseError('Permission not found');
    role.permissions = role.permissions.filter(p => p.id !== permission.id);
    const updatedRole = await this.roleRepository.save(role);
    return updatedRole;
  }
}