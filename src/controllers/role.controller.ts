// import { Response } from "express";
// import catchAsync from "../utils/catchAsync";
// import { StatusCodes } from "http-status-codes";
// import RoleService from "../services/role.service";
// import { sendSuccess } from "../utils/apiResponse";
// import { CustomRequest } from "../middlewares/auth";
// import { CreateRoleDto } from '../dtos/role.dto';

// const roleService = new RoleService();

// export const createRole = catchAsync(async (req: CustomRequest, res: Response) => {
//   const companyId = Number(req.params.companyId);
//   const body: CreateRoleDto = {
//     ...req.body,
//     companyId
//   }
//   const { name, description, permissions } = req.body;
//   const role = await roleService.createRole(body);
//   sendSuccess(res, StatusCodes.CREATED, "Role created successfully", role);
// });

// export const getCompanyRoles = catchAsync(async (req: CustomRequest, res: Response) => {
//   const roles = await roleService.listRoles(Number(req.params.companyId));
//   sendSuccess(res, StatusCodes.OK, "Roles fetched successfully", roles);
// });

// export const addPermissionsToRole = catchAsync(async (req: CustomRequest, res: Response) => {
//   const role = await roleService.addPermissionsToRole(
//     Number(req.params.roleId),
//     req.body.permissions
//   );
//   sendSuccess(res, StatusCodes.OK, "Permissions added successfully", role);
// });
