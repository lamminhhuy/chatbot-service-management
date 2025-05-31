import { inject, injectable } from "tsyringe";
import { BadRequestResponseError } from "@/shared/response/errors.response";
import { PermissionService } from "@/modules/authorization/services/PermissionService";
import { Role } from "@/modules/authorization/models/RoleModel";
import { RoleCode } from "@/modules/user/enums/Role";
import { IRoleRepository } from "@/modules/user/interfaces/IRoleRepository";
import { CreateRoleDTO } from "@/modules/authorization/dtos/CreateRole.dto";
import { UpdateRoleDTO } from "../dtos/UpdateRole.dto";
import { Permission } from "../models/PermissionModel";
@injectable()
export class RoleService {
  constructor(
    @inject("IRoleRepository") private readonly roleRepository: IRoleRepository,
    @inject(PermissionService)
    private readonly permissionService: PermissionService
  ) {}
  async createRole(roleData: CreateRoleDTO): Promise<Role> {
    const role = Role.createRole(roleData);
    const isRoleExists = await this.roleRepository.findRoleByCode(role.code);
    if (isRoleExists) throw new BadRequestResponseError("Role already exists");
    return this.roleRepository.createRole(role);
  }
  async updateRole(roleId: number, roleData: UpdateRoleDTO): Promise<Role> {
    const role = await this.findRolebyId(roleId);
    if (!role) throw new BadRequestResponseError("Role not found");
    role.name = roleData.name;
    role.description = roleData.description;
    return this.roleRepository.save(role);
  }
  async findRoleByCode(code: RoleCode): Promise<Role | null> {
    return this.roleRepository.findRoleByCode(code);
  }

  async findRolebyId(roleId: number): Promise<Role | null> {
    return this.roleRepository.findRoleById(roleId);
  }

  async assignPermission(
    roleId: number,
    permissionIds: number[]
  ): Promise<Role> {
    const role = await this.findRolebyId(roleId);
    if (!role) throw new BadRequestResponseError("Role not found");
    const permissions = await this.permissionService.findPermissionByIds(
      permissionIds
    );
    const isPermissionIdsValid =
      permissions && permissions.length !== permissionIds.length;
    if (isPermissionIdsValid) {
      const foundIds = permissions.map((p) => p.id);
      const missingIds = permissionIds.filter((id) => !foundIds.includes(id));
      throw new BadRequestResponseError(
        `Permissions with IDs ${missingIds.join(", ")} not found`
      );
    }
    const newPermissions = permissions?.filter(
      (p) => !role.permissions.some((rp) => rp.id === p.id)
    );
    if (newPermissions) {
      role.permissions.push(...newPermissions);
    }
    const updatedRole = await this.roleRepository.save(role);
    return updatedRole;
  }

  async revokePermission(
    roleId: number,
    permissionIds: number[]
  ): Promise<Role> {
    const role = await this.findRolebyId(roleId);
    if (!role) throw new BadRequestResponseError("Role not found");
    const permissions = await this.permissionService.findPermissionByIds(
      permissionIds
    );
    if (!permissions) throw new BadRequestResponseError("Permission not found");
    const isPermissionIdsValid = permissions.length === permissionIds.length;
    if (!isPermissionIdsValid) {
      const foundIds = permissions.map((p) => p.id);
      const missingIds = permissionIds.filter((id) => !foundIds.includes(id));
      throw new BadRequestResponseError(
        `Permissions with IDs ${missingIds.join(", ")} not found`
      );
    }
    const newPermissions = role.permissions?.filter((rp) =>
      permissions.some((p) => p.id !== rp.id)
    );
    if (newPermissions) {
      role.permissions = newPermissions;
    }
    const updatedRole = await this.roleRepository.save(role);
    return updatedRole;
  }
  async getAllRoles(): Promise<Role[]> {
    return this.roleRepository.getAllRoles();
  }
  async deleteRole(roleId: number): Promise<void> {
    const role = await this.findRolebyId(roleId);
    if (!role) throw new BadRequestResponseError("Role not found");
    if(role.code  === RoleCode.ASSISTANT) throw new BadRequestResponseError("Role Assistant cannot be deleted");
    if(role.code  === RoleCode.BASIC_USER) throw new BadRequestResponseError("Role Basic User cannot be deleted");
    const isManager = role.code === RoleCode.MANAGER;
    if(!isManager) throw new BadRequestResponseError("Role Manager cannot be deleted");
    const isAdmin = role.code === RoleCode.ADMIN;
    if(!isAdmin) throw new BadRequestResponseError("Role Admin cannot be deleted");
    await this.roleRepository.delete(roleId);
  }
}
