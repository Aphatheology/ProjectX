import { Request, Response, NextFunction } from 'express';
import config from '../config/config';
import logger from '../config/logger';
import { StatusCodes } from 'http-status-codes';
import { sendError } from './apiResponse';
import ApiError from './apiError';
import { TypeORMError, QueryFailedError } from 'typeorm';

export const errorConverter = (err: any, _req: Request, _res: Response, next: NextFunction) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    let message = error.message || `${StatusCodes[statusCode]}`;

    if (error instanceof TypeORMError) {
      statusCode = StatusCodes.BAD_REQUEST;

      if (error instanceof QueryFailedError) {
        const pgError = error.driverError;

        if (pgError && pgError.code === '23503') {
          message = 'Foreign key constraint violation';
          const constraintMatch = pgError.detail?.match(/constraint "(.+?)"/);
          const constraintName = constraintMatch ? constraintMatch[1] : '';

          if (pgError.table) {
            message = `Unable to ${pgError.detail?.includes('still referenced') ? 'delete' : 'save'} because a related record in ${pgError.table} does not exist`;
          }

          error = new ApiError(statusCode, message, true, err.stack, {
            constraint: constraintName,
            detail: pgError.detail,
            table: pgError.table
          });

          next(error);
          return;
        }

        if (pgError && pgError.code === '23505') {
          message = 'Unique constraint violation';
          const constraintMatch = pgError.detail?.match(/Key \((.+?)\)=/);
          const field = constraintMatch ? constraintMatch[1] : '';

          message = `A record with this ${field} already exists`;

          error = new ApiError(statusCode, message, true, err.stack, {
            field,
            detail: pgError.detail
          });

          next(error);
          return;
        }
      }
    }
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

export const errorHandler = (err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  let { statusCode, message } = err;

  if (config.env === 'production' && !err.isOperational) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = 'Internal Server Error';
  }

  res.locals['errorMessage'] = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  const errorPayload = {
    ...(err.errors || {}),
    ...(config.env === 'development' ? { stack: err.stack } : {})
  };

  sendError(res, statusCode, message, errorPayload);
};