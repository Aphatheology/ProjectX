import { AppDataSource } from '../config/database';
import { Permission } from '../entities/Permission';
import { Role } from '../entities/Role';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/apiError';
import { In } from 'typeorm';
import { RolePermission } from '../entities/RolePermission';
import { CreateRoleDto } from 'dtos/role.dto';

export default class RoleService {
  private roleRepository = AppDataSource.getRepository(Role);
  private permissionRepository = AppDataSource.getRepository(Permission);
  private rolePermissionRepository = AppDataSource.getRepository(RolePermission);

  async getAllRoles(companyId?: string): Promise<Role[]> {
    const query = this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.rolePermissions', 'rp')
      .leftJoinAndSelect('rp.permission', 'permission')
      .leftJoinAndSelect('role.company', 'company');

    if (companyId) {
      query.where('company.id = :companyId', { companyId });
    }

    return query.getMany();
  }

  async getRoleById(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['company']
    });

    if (!role) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Role not found');
    }

    return role;
  }

  async getPermissionsByRoleId(roleId: string): Promise<Permission[]> {
    const permissions = await this.permissionRepository
      .createQueryBuilder('p')
      .innerJoin('p.rolePermissions', 'rp')
      .where('rp.roleId = :roleId', { roleId })
      .getMany();

    if (permissions.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'No permissions found for role');
    }

    return permissions;
  }

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
      relations: ['company']
    });

    if (existingRole && existingRole.company?.id === createRoleDto?.companyId) {
      throw new ApiError(StatusCodes.CONFLICT, 'Role with this name already exists in the company');
    }

    const newRole = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(newRole);
  }

  async updateRole(id: string, roleData: Partial<Role>): Promise<Role> {
    const role = await this.getRoleById(id);

    if (roleData.name && roleData.name !== role.name) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: roleData.name },
        relations: ['company']
      });

      if (existingRole && existingRole.company?.id === role.company?.id) {
        throw new ApiError(StatusCodes.CONFLICT, 'Role with this name already exists in the company');
      }
    }

    Object.assign(role, roleData);
    return this.roleRepository.save(role);
  }

  async deleteRole(id: string): Promise<void> {
    const role = await this.getRoleById(id);
    await this.roleRepository.remove(role);
  }

  async assignPermissionsToRole(roleId: string, permissionIds: string[]): Promise<Role> {
    const role = await this.getRoleById(roleId);

    const permissions = await this.permissionRepository.findBy({
      id: In(permissionIds)
    });

    if (permissions.length !== permissionIds.length) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'One or more permissions not found');
    }

    const rolePermissions = permissions.map(permission => {
      const rolePermission = new RolePermission();
      rolePermission.roleId = roleId;
      rolePermission.permissionId = permission.id;
      return rolePermission;
    });

    await this.rolePermissionRepository.save(rolePermissions);

    return this.getRoleById(roleId);
  }

  async removePermissionFromRole(roleId: string, permissionId: string): Promise<Role> {
    await this.rolePermissionRepository.delete({
      roleId,
      permissionId
    });

    return this.getRoleById(roleId);
  }
}
