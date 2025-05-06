import { Response } from "express";
import catchAsync from "../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import PermissionService from "../services/permission.service";
import { sendSuccess } from "../utils/apiResponse";
import { CustomRequest } from "../middlewares/auth";

const permissionService = new PermissionService();

export const createPermission = catchAsync(async (req: CustomRequest, res: Response) => {
  // const { name, description } = req.body;
  const permission = await permissionService.createPermission(req.body);
  sendSuccess(res, StatusCodes.CREATED, "Permission created successfully", permission);
});

export const getPermissions = catchAsync(async (_req: CustomRequest, res: Response) => {
  const permissions = await permissionService.listPermissions();
  sendSuccess(res, StatusCodes.OK, "Permissions fetched successfully", permissions);
});
