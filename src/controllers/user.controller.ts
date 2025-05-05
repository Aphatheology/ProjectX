import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { StatusCodes } from 'http-status-codes';
import { CustomRequest } from '../middlewares/auth';
import UserService from '../services/user.service';
import { sendSuccess } from '../utils/apiResponse';

const userService = new UserService();

export const getProfile = catchAsync(async (req: CustomRequest, res: Response): Promise<any> => {
    const user = await userService.getProfile(req.user);
    sendSuccess(res, StatusCodes.OK, 'User profile fetched successfully', user);
});
