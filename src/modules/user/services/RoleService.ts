
import { Role } from '@/modules/role/models/RoleModel';
import { RoleCode } from '../enums/Role';
import { IRoleRepository } from '../interfaces/IRoleRepository';
import { inject, injectable } from 'tsyringe';
@injectable()
export class RoleService {
  constructor(
   @inject('IRoleRepository') private readonly roleRepository: IRoleRepository, 
  ) {}

  async findRoleByCode(code: RoleCode): Promise<Role | null> {
    return this.roleRepository.findRoleByCode(code);
  }

  async findRolebyId(roleId: number): Promise<Role | null> {
      return this.roleRepository.findRoleById(roleId);
  }

  async createRole(roleData: Partial<Role>): Promise<Role> {
    const role = this.roleRepository.create(roleData);
    return this.roleRepository.save(role);
  }
}
