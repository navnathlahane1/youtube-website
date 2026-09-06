import { Request, Response, NextFunction } from 'express';
import { ProjectsService } from './projects.service';
import { sendSuccess, sendCreated, sendPaginated } from '../../common/utils/response';
import { AuthenticatedRequest } from '../../common/types';
import { AnalyticsEventModel } from '../analytics/analytics.model';

export class ProjectsController {
  static async listPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 12;
      const { branchId, category, tech, difficulty, search } = req.query as any;

      const result = await ProjectsService.listPublic(
        { branchId, category, tech, difficulty, search },
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
      const { status, search } = req.query as any;

      const result = await ProjectsService.listAdmin({ status, search }, page, limit);
      return sendPaginated(res, result.items, result.total, result.page, result.limit);
    } catch (error) {
      return next(error);
    }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await ProjectsService.getBySlug(req.params.slug, true);

      AnalyticsEventModel.create({
        event: 'project_view',
        resourceType: 'project',
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
      const created = await ProjectsService.create(req.body, req.admin);
      return sendCreated(res, created, 'Project created successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await ProjectsService.update(req.params.id, req.body, req.admin);
      return sendSuccess(res, updated, 'Project updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await ProjectsService.updateStatus(req.params.id, req.body.status, req.admin);
      return sendSuccess(res, updated, `Status changed to ${req.body.status}`);
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await ProjectsService.delete(req.params.id, req.admin);
      return sendSuccess(res, null, 'Project deleted successfully');
    } catch (error) {
      return next(error);
    }
  }
}
