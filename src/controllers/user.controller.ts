import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { StatusCodes } from 'http-status-codes';
import UserService from '../services/user.service';
import { sendSuccess } from '../utils/apiResponse';

const userService = new UserService();

export const getProfile = catchAsync(async (req: Request, res: Response): Promise<any> => {
  const currentUserId = (req as any).user.userId;
  const user = await userService.getProfile(currentUserId);
  sendSuccess(res, StatusCodes.OK, 'User profile fetched successfully', user);
});

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = (req as any).user.userId;
  const user = await userService.createUser(req.body, currentUserId);
  sendSuccess(res, StatusCodes.CREATED, "User created successfully", user);
});

// export const getUsers = catchAsync(async (req: CustomRequest, res: Response) => {
//   const users = await userService.listUsers(req.user!.company.id);
//   sendSuccess(res, StatusCodes.OK, "Users fetched successfully", users);
// });

// export const getUser = catchAsync(async (req: CustomRequest, res: Response) => {
//   const user = await userService.getUserById(Number(req.params.userId));
//   sendSuccess(res, StatusCodes.OK, "User fetched successfully", user);
// });

// export const updateUser = catchAsync(async (req: CustomRequest, res: Response) => {
//   const user = await userService.updateUser(Number(req.params.userId), req.body);
//   sendSuccess(res, StatusCodes.OK, "User updated successfully", user);
// });

// export const deleteUser = catchAsync(async (req: CustomRequest, res: Response) => {
//   const user = await userService.deleteUser(Number(req.params.userId));
//   sendSuccess(res, StatusCodes.OK, "User deleted successfully", user);
// });
