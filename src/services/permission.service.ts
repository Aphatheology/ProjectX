import { AppDataSource } from '../config/database';
import { Permission } from '../entities/Permission';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/apiError';

export default class PermissionService {
  private permissionRepository = AppDataSource.getRepository(Permission);

  async getAllPermissions(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }

  async getPermissionById(id: string): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
      relations: ['roles']
    });

    if (!permission) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Permission not found');
    }

    return permission;
  }

  async createPermission(permissionData: Partial<Permission>): Promise<Permission> {
    const existingPermission = await this.permissionRepository.findOne({
      where: { name: permissionData.name }
    });

    if (existingPermission) {
      throw new ApiError(StatusCodes.CONFLICT, 'Permission with this name already exists');
    }

    const newPermission = this.permissionRepository.create(permissionData);
    return this.permissionRepository.save(newPermission);
  }

  async updatePermission(id: string, permissionData: Partial<Permission>): Promise<Permission> {
    const permission = await this.getPermissionById(id);

    // Check if the permission name is being updated and if it already exists
    if (permissionData.name && permissionData.name !== permission.name) {
      const existingPermission = await this.permissionRepository.findOne({
        where: { name: permissionData.name }
      });

      if (existingPermission) {
        throw new ApiError(StatusCodes.CONFLICT, 'Permission with this name already exists');
      }
    }

    Object.assign(permission, permissionData);
    return this.permissionRepository.save(permission);
  }

  async deletePermission(id: string): Promise<void> {
    const permission = await this.getPermissionById(id);
    await this.permissionRepository.remove(permission);
  }
}