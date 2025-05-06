import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import config from "../config/config";
import { AppDataSource } from "../dataSource";
import { User } from "../entities/User";

export interface CustomRequest extends Request {
  user: User;
}

export const auth = (...requiredPermissions: string[]): RequestHandler => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Please authenticate");
      }
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, config.jwt.accessTokenSecret) as { id: number };
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({
        where: { id: decoded.id },
        relations: ["role", "role.permissions", "company"]
      });
      if (!user) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Please authenticate");
      }
      (req as CustomRequest).user = user;
      
      if (requiredPermissions.length) {
        const userPermissions = user.role.permissions.map(p => p.name);
        const hasPermission = requiredPermissions.some(rp => userPermissions.includes(rp));
        const paramUserId = req.params.userId ? Number(req.params.userId) : undefined;
        if (!hasPermission && paramUserId !== user.id) {
          throw new ApiError(StatusCodes.FORBIDDEN, "Forbidden");
        }
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
