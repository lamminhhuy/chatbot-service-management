
import { Repository } from 'typeorm';
import { Role } from '../models/RoleModel';
import { RoleCode } from '../enums/Role';
import { IRoleRepository } from '../interfaces/IRoleRepository';

export class RoleService {
  constructor(
    private readonly roleRepository: IRoleRepository, 
  ) {}

  async findRoleByCode(code: RoleCode): Promise<Role | null> {
    return this.roleRepository.findRoleByCode(code);
  }

  async createRole(roleData: Partial<Role>): Promise<Role> {
    const role = this.roleRepository.create(roleData);
    return this.roleRepository.save(role);
  }
}