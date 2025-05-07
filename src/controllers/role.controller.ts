import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import RoleService from '../services/role.service';
import catchAsync from '../utils/catchAsync';
import { sendSuccess } from '../utils/apiResponse';

const roleService = new RoleService();

export const getAllRoles = catchAsync(async (req: Request, res: Response): Promise<any> => {
  const companyId = req.query.companyId as string;
  const roles = await roleService.getAllRoles(companyId);
  sendSuccess(res, StatusCodes.OK, 'Roles fetched successfully', roles);
});

export const getRoleById = catchAsync(async (req: Request, res: Response): Promise<any> => {
  const roleId = req.params.id;
  const role = await roleService.getRoleById(roleId);
  sendSuccess(res, StatusCodes.OK, 'Role fetched successfully', role);
});

export const getPermissionsByRoleId = catchAsync(async (req: Request, res: Response): Promise<any> => {
  const roleId = req.params.id;
  const permissions = await roleService.getPermissionsByRoleId(roleId);
  sendSuccess(res, StatusCodes.OK, 'Permissions by RoleId fetched successfully', permissions);
});

export const createRole = catchAsync(async (req: Request, res: Response): Promise<any> => {
  const roleData = req.body;
  const newRole = await roleService.createRole(roleData);
  sendSuccess(res, StatusCodes.CREATED, 'Role created successfully', newRole);
});

export const updateRole = catchAsync(async (req: Request, res: Response): Promise<any> => {
  const roleId = req.params.id;
  const roleData = req.body;
  const updatedRole = await roleService.updateRole(roleId, roleData);
  sendSuccess(res, StatusCodes.OK, 'Role updated successfully', updatedRole);
});

export const deleteRole = catchAsync(async (req: Request, res: Response): Promise<any> => {
  const roleId = req.params.id;
  await roleService.deleteRole(roleId);
  sendSuccess(res, StatusCodes.OK, 'Role deleted successfully');
});

export const assignPermissions = catchAsync(async (req: Request, res: Response): Promise<any> => {
  const roleId = req.params.id;
  const { permissionIds } = req.body;
  const updatedRole = await roleService.assignPermissionsToRole(roleId, permissionIds);
  sendSuccess(res, StatusCodes.OK, 'Permissions assigned successfully', updatedRole);
});

export const removePermission = catchAsync(async (req: Request, res: Response): Promise<any> => {
  const roleId = req.params.id;
  const permissionId = req.params.permissionId;
  const updatedRole = await roleService.removePermissionFromRole(roleId, permissionId);
  sendSuccess(res, StatusCodes.OK, 'Permission removed successfully', updatedRole);
});
