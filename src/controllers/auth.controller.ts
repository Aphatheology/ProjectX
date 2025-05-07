import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { StatusCodes } from 'http-status-codes';
import AuthService from '../services/auth.service';
import { sendSuccess } from '../utils/apiResponse';

const authService = new AuthService();

export const registerSuperAdmin = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const user = await authService.registerSuperAdmin(req.body);
  sendSuccess(res, StatusCodes.CREATED, 'SuperAdmin registered successfully', user);
});

export const login = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const user = await authService.login(req.body);
  sendSuccess(res, StatusCodes.OK, 'User login successfully', user);
});
