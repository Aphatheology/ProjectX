import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { StatusCodes } from 'http-status-codes';
import config from "../config/config";
import { User } from '../entities/User';
import { AppDataSource } from "../dataSource";

export interface CustomRequest extends Request {
  user: User;
  token?: string
}

const userRepository = AppDataSource.getRepository(User);

const auth: RequestHandler  = async (req, res, next): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  try {
    if (!token) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Please authenticate");
    }
    const decoded = jwt.verify(token, config.jwt.accessTokenSecret) as { id: number };

    const user = await userRepository.findOneBy({ id: decoded.id });

    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Please authenticate");
    }

    (req as CustomRequest).user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default auth;
