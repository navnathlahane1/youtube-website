import { Response } from 'express';
import { ApiResponse } from '../types';

export function sendSuccess<T>(res: Response, data: T, message?: string, statusCode = 200) {
  const payload: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(payload);
}

export function sendCreated<T>(res: Response, data: T, message = 'Resource created successfully') {
  return sendSuccess(res, data, message, 201);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  message?: string
) {
  const totalPages = Math.ceil(total / limit) || 1;
  const payload: ApiResponse<T[]> = {
    success: true,
    message,
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
  return res.status(200).json(payload);
}

export function sendError(res: Response, message: string, statusCode = 500, errors?: any) {
  const payload: ApiResponse = {
    success: false,
    message,
    errors,
  };
  return res.status(statusCode).json(payload);
}
