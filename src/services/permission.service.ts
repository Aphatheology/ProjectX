import { Repository } from 'typeorm';
import { AppDataSource } from '../dataSource';
import { Permission } from '../entities/Permission';
import ApiError from '../utils/apiError';
import httpStatus from 'http-status';
import { CreatePermissionDto } from '../dtos/permission.dto';

export default class PermissionService {
  private permissionRepository: Repository<Permission>;

  constructor() {
    this.permissionRepository = AppDataSource.getRepository(Permission);
  }

  async createPermission(createPermissionDto: CreatePermissionDto) {
    const { name, description } = createPermissionDto;
    if (await this.permissionRepository.findOneBy({ name })) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Permission name is already taken');
    }
    const permission = this.permissionRepository.create({ name, description });
    return this.permissionRepository.save(permission);
  }

  async getPermissionByNameExternal(name: string) {
    const permission = await this.permissionRepository.findOneBy({ name });
    return permission;
  }

  async getPermissionByName(name: string) {
    const permission = await this.permissionRepository.findOneBy({ name });
    if (!permission) throw new ApiError(httpStatus.NOT_FOUND, 'Permission not found');
    return permission;
  }

  async getPermissionById(id: number) {
    const permission = await this.permissionRepository.findOneBy({ id });
    if (!permission) throw new ApiError(httpStatus.NOT_FOUND, 'Permission not found');
    return permission;
  }

  async listPermissions() {
    return this.permissionRepository.find({ select: ['id', 'name', 'description'] });
  }

  async deletePermission(id: number) {
    const permission = await this.getPermissionById(id);
    await this.permissionRepository.remove(permission);
    return permission;
  }
}
