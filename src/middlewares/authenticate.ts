import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { Role } from '../entities/Role';
import { RolePermission } from '../entities/RolePermission';
import { Permission } from '../entities/Permission';
import ApiError from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
import config from '../config/config';

interface DecodedToken {
  userId: string;
  email: string;
  isSuperAdmin: boolean;
  roleId: string;
  iat: number;
  exp: number;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Please authenticate");
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, config.jwt.accessTokenSecret) as DecodedToken;

    (req as any).user = decoded;

    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token! Please authenticate'));
    }
    next(error);
  }
};

export const requireSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: (req as any).user.userId });
    if (!user || !user.isSuperAdmin) {
      return next(new ApiError(StatusCodes.FORBIDDEN, 'Forbidden'));
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const requirePermission = (permissionName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { userId, isSuperAdmin, roleId } = (req as any).user;

      if (isSuperAdmin) {
        return next();
      }

      if (!roleId) {
        throw new ApiError(StatusCodes.FORBIDDEN, "Forbidden");
      }

      const rolePermissionRepository = AppDataSource.getRepository(RolePermission);
      const permissionRepository = AppDataSource.getRepository(Permission);

      const permission = await permissionRepository.findOneBy({ name: permissionName });
      if (!permission) {
        throw new ApiError(StatusCodes.FORBIDDEN, "Forbidden");
      }

      const rolePermission = await rolePermissionRepository.findOneBy({
        roleId,
        permissionId: permission.id
      });

      if (!rolePermission) {
        throw new ApiError(StatusCodes.FORBIDDEN, "Forbidden");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};