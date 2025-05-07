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
