import { Repository, In } from 'typeorm';
import { AppDataSource } from '../dataSource';
import { Role } from '../entities/Role';
import ApiError from '../utils/apiError';
import httpStatus from 'http-status';
import { CreateRoleDto } from 'dtos/role.dto';

export default class RoleService {
  private repo: Repository<Role> = AppDataSource.getRepository(Role);

  async createRole(createRoleDto: CreateRoleDto) {
    const {name, description, permissionIds, companyId} = createRoleDto;
    if (await this.repo.findOne({ where: { name, company: { id: companyId } } })) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Role name is already taken for this company');
    }
    const role = this.repo.create({
      name,
      description,
      company: { id: companyId } as any,
      permissions: permissionIds.map(id => ({ id } as any)),
    });
    return this.repo.save(role);
  }

  async getRoleById(id: number) {
    const role = await this.repo.findOne({
      where: { id },
      relations: ['permissions','company']
    });
    if (!role) throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
    return role;
  }

  async getCompanyByRoleId(roleId: number) {
    const role = await this.repo.findOne({
      where: { id: roleId },
      relations: ['permissions','company']
    });
    if (!role) throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
    return role;
  }

  async addPermissionsToRole(roleId: number, permissionIds: number[]) {
    const role = await this.getRoleById(roleId);
    const existing = role.permissions.map(p => p.id);
    const toAdd = permissionIds.filter(id => !existing.includes(id));
    role.permissions.push(...toAdd.map(id => ({ id } as any)));
    return this.repo.save(role);
  }

  async listRoles(companyId: number) {
    return this.repo.find({
      where: { company: { id: companyId } },
      relations: ['permissions']
    });
  }

  async deleteRole(id: number) {
    const role = await this.getRoleById(id);
    await this.repo.remove(role);
    return role;
  }
}
