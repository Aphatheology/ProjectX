import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import PermissionService from '../services/permission.service';
import catchAsync from "../utils/catchAsync";
import { sendSuccess } from '../utils/apiResponse';

const permissionService = new PermissionService();

export const getAllPermissions = catchAsync(async (req: Request, res: Response): Promise<any> => {
  const permissions = await permissionService.getAllPermissions();
  sendSuccess(res, StatusCodes.OK, 'Permissions fetched successfully', permissions);
});

export const getPermissionById = catchAsync(async (req: Request, res: Response): Promise<any> => {
  const permissionId = req.params.id;
  const permission = await permissionService.getPermissionById(permissionId);
  sendSuccess(res, StatusCodes.OK, 'Permission fetched successfully', permission);
});

export const createPermission = catchAsync(async (req: Request, res: Response): Promise<any> => {
  const permissionData = req.body;
  const newPermission = await permissionService.createPermission(permissionData);
  sendSuccess(res, StatusCodes.CREATED, 'Permission created successfully', newPermission);
});

export const updatePermission = catchAsync(async (req: Request, res: Response): Promise<any> => {
  const permissionId = req.params.id;
  const permissionData = req.body;
  const updatedPermission = await permissionService.updatePermission(permissionId, permissionData);
  sendSuccess(res, StatusCodes.OK, 'Permission updated successfully', updatedPermission);
});

export const deletePermission = catchAsync(async (req: Request, res: Response): Promise<any> => {
  const permissionId = req.params.id;
  await permissionService.deletePermission(permissionId);
  sendSuccess(res, StatusCodes.OK, 'Permission deleted successfully');
});
