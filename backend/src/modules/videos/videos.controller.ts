import { Request, Response, NextFunction } from 'express';
import { VideosService } from './videos.service';
import { sendSuccess, sendCreated, sendPaginated } from '../../common/utils/response';
import { AuthenticatedRequest } from '../../common/types';
import { AnalyticsEventModel } from '../analytics/analytics.model';

export class VideosController {
  static async listPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 12;
      const { branchId, semesterId, subjectId, search } = req.query as any;
      const unitNumber = req.query.unitNumber ? parseInt(req.query.unitNumber as string, 10) : undefined;

      const result = await VideosService.listPublic(
        { branchId, semesterId, subjectId, unitNumber, search },
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

      const result = await VideosService.listAdmin(
        { branchId, semesterId, subjectId, status, search },
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
      const item = await VideosService.getBySlug(req.params.slug, true);

      AnalyticsEventModel.create({
        event: 'video_clicked',
        resourceType: 'video',
        resourceId: item._id.toString(),
        resourceTitle: item.title,
        timestamp: new Date(),
      }).catch(() => {});

      return sendSuccess(res, item);
    } catch (error) {
      return next(error);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const created = await VideosService.create(req.body, req.admin);
      return sendCreated(res, created, 'Video lecture created successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await VideosService.update(req.params.id, req.body, req.admin);
      return sendSuccess(res, updated, 'Video lecture updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await VideosService.updateStatus(req.params.id, req.body.status, req.admin);
      return sendSuccess(res, updated, `Status changed to ${req.body.status}`);
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await VideosService.delete(req.params.id, req.admin);
      return sendSuccess(res, null, 'Video lecture deleted successfully');
    } catch (error) {
      return next(error);
    }
  }
}
