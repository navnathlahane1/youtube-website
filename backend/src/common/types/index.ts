import { Request } from 'express';
import { AdminRole } from '../constants';

export interface AdminPayload {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}

export interface SessionData {
  sessionId: string;
  adminId: string;
  email: string;
  role: AdminRole;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  admin?: AdminPayload;
  sessionData?: SessionData;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    [key: string]: any;
  };
  errors?: any;
}

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
