import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors';
import { logger } from '../../config/logger';
import { sendError } from '../utils/response';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  // Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    logger.warn(`Validation error on ${req.method} ${req.url}:`, formattedErrors);
    return sendError(res, 'Validation error', 422, formattedErrors);
  }

  // Known Application Errors
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(`AppError on ${req.method} ${req.url}:`, err);
    } else {
      logger.warn(`AppError (${err.statusCode}) on ${req.method} ${req.url}: ${err.message}`);
    }
    return sendError(res, err.message, err.statusCode, err.details);
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'Field';
    const message = `${field} already exists with value '${err.keyValue?.[field]}'`;
    return sendError(res, message, 409);
  }

  // Mongoose Cast Error
  if (err.name === 'CastError') {
    return sendError(res, `Invalid format for parameter '${err.path}'`, 400);
  }

  // Unexpected Internal Errors
  logger.error(`Unhandled error on ${req.method} ${req.url}:`, err);
  return sendError(
    res,
    process.env.NODE_ENV === 'production' ? 'Internal server error' : (err.message || 'Internal error'),
    500
  );
}
