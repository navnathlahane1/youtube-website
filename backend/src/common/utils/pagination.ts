import { Request } from 'express';
import { PaginationParams } from '../types';

export function getPagination(req: Request, defaultLimit = 20, maxLimit = 100): PaginationParams {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const requestedLimit = parseInt(req.query.limit as string, 10) || defaultLimit;
  const limit = Math.min(Math.max(1, requestedLimit), maxLimit);
  const skip = (page - 1) * limit;

  const sortBy = req.query.sortBy as string | undefined;
  const sortOrder = (req.query.sortOrder === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc';

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
}
