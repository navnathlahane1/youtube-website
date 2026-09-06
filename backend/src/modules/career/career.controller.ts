import { Request, Response, NextFunction } from 'express';
import { CareerService } from './career.service';
import { sendSuccess, sendCreated, sendPaginated } from '../../common/utils/response';
import { AuthenticatedRequest } from '../../common/types';

export class CareerController {
  static async listPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 12;
      const { type, domain, search } = req.query as any;

      const result = await CareerService.listPublic({ type, domain, search }, page, limit);
      return sendPaginated(res, result.items, result.total, result.page, result.limit);
    } catch (error) {
      return next(error);
    }
  }

  static async listAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      const { type, status, search } = req.query as any;

      const result = await CareerService.listAdmin({ type, status, search }, page, limit);
      return sendPaginated(res, result.items, result.total, result.page, result.limit);
    } catch (error) {
      return next(error);
    }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await CareerService.getBySlug(req.params.slug, true);
      return sendSuccess(res, item);
    } catch (error) {
      return next(error);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const created = await CareerService.create(req.body, req.admin);
      return sendCreated(res, created, 'Career resource created successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await CareerService.update(req.params.id, req.body, req.admin);
      return sendSuccess(res, updated, 'Career resource updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await CareerService.updateStatus(req.params.id, req.body.status, req.admin);
      return sendSuccess(res, updated, `Status changed to ${req.body.status}`);
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await CareerService.delete(req.params.id, req.admin);
      return sendSuccess(res, null, 'Career resource deleted successfully');
    } catch (error) {
      return next(error);
    }
  }
}
