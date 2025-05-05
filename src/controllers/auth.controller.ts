import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { StatusCodes } from 'http-status-codes';
import * as authService from '../services/auth.service';
import { sendSuccess } from '../utils/apiResponse';

export const register = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const user = await authService.register(req.body);
  console.log(user);
  sendSuccess(res, StatusCodes.CREATED, 'User registered successfully', user);
});

export const login = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const user = await authService.login(req.body);
  sendSuccess(res, StatusCodes.OK, 'User login successfully', user);
});
