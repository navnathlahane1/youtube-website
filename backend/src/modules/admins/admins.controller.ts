import { Request, Response, NextFunction } from 'express';
import { AdminsService } from './admins.service';
import { sendSuccess, sendCreated } from '../../common/utils/response';
import { AuthenticatedRequest } from '../../common/types';

export class AdminsController {
  static async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const items = await AdminsService.list();
      return sendSuccess(res, items);
    } catch (error) {
      return next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await AdminsService.getById(req.params.id);
      return sendSuccess(res, item);
    } catch (error) {
      return next(error);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const created = await AdminsService.create(req.body, req.admin);
      return sendCreated(res, created, 'Admin user created successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await AdminsService.update(req.params.id, req.body, req.admin);
      return sendSuccess(res, updated, 'Admin user updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await AdminsService.delete(req.params.id, req.admin);
      return sendSuccess(res, null, 'Admin user deleted successfully');
    } catch (error) {
      return next(error);
    }
  }
}
