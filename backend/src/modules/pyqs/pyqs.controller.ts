import { Request, Response, NextFunction } from 'express';
import { PYQsService } from './pyqs.service';
import { sendSuccess, sendCreated, sendPaginated } from '../../common/utils/response';
import { AuthenticatedRequest } from '../../common/types';
import { AnalyticsEventModel } from '../analytics/analytics.model';

export class PYQsController {
  static async listPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 12;
      const { branchId, semesterId, subjectId, difficulty, search } = req.query as any;
      const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;

      const result = await PYQsService.listPublic(
        { branchId, semesterId, subjectId, year, difficulty, search },
        page,
        limit
      );

      return sendPaginated(res, result.items, result.total, result.page, result.limit);
    } catch (error) {
      return next(error);
    }
  }

  static async listAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      const sortBy = (req.query.sortBy as string) || 'createdAt';
      const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';
      const { branchId, semesterId, subjectId, status, search } = req.query as any;
      const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;

      const result = await PYQsService.listAdmin(
        { branchId, semesterId, subjectId, year, status, search },
        page,
        limit,
        sortBy,
        sortOrder
      );

      return sendPaginated(res, result.items, result.total, result.page, result.limit);
    } catch (error) {
      return next(error);
    }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await PYQsService.getBySlug(req.params.slug, true);

      // Async telemetry
      AnalyticsEventModel.create({
        event: 'resource_view',
        resourceType: 'pyq',
        resourceId: item._id.toString(),
        resourceTitle: item.title,
        timestamp: new Date(),
      }).catch(() => {});

      return sendSuccess(res, item);
    } catch (error) {
      return next(error);
    }
  }

  static async trackDownload(req: Request, res: Response, next: NextFunction) {
    try {
      await PYQsService.incrementDownload(req.params.id);

      AnalyticsEventModel.create({
        event: 'resource_download',
        resourceType: 'pyq',
        resourceId: req.params.id,
        timestamp: new Date(),
      }).catch(() => {});

      return sendSuccess(res, null, 'Download tracked');
    } catch (error) {
      return next(error);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const created = await PYQsService.create(req.body, req.admin);
      return sendCreated(res, created, 'PYQ paper created successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await PYQsService.update(req.params.id, req.body, req.admin);
      return sendSuccess(res, updated, 'PYQ paper updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await PYQsService.updateStatus(req.params.id, req.body.status, req.admin);
      return sendSuccess(res, updated, `Status changed to ${req.body.status}`);
    } catch (error) {
      return next(error);
    }
  }

  static async bulkStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { ids, status } = req.body;
      await PYQsService.bulkUpdateStatus(ids, status, req.admin);
      return sendSuccess(res, null, `Bulk status updated to ${status}`);
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await PYQsService.delete(req.params.id, req.admin);
      return sendSuccess(res, null, 'PYQ paper deleted successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async bulkDelete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await PYQsService.bulkDelete(req.body.ids, req.admin);
      return sendSuccess(res, null, 'Selected PYQ papers deleted');
    } catch (error) {
      return next(error);
    }
  }
}
