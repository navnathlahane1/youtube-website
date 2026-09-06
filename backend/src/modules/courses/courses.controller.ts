import { Request, Response, NextFunction } from 'express';
import { CoursesService } from './courses.service';
import { sendSuccess, sendCreated } from '../../common/utils/response';
import { AuthenticatedRequest } from '../../common/types';

export class CoursesController {
  static async listPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const branchId = req.query.branchId as string | undefined;
      const category = req.query.category as string | undefined;
      const featuredOnly = req.query.featured === 'true';

      const items = await CoursesService.listPublic({ branchId, category, featuredOnly });
      return sendSuccess(res, items);
    } catch (error) {
      return next(error);
    }
  }

  static async listAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const items = await CoursesService.listAdmin();
      return sendSuccess(res, items);
    } catch (error) {
      return next(error);
    }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await CoursesService.getBySlug(req.params.slug);
      return sendSuccess(res, item);
    } catch (error) {
      return next(error);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const created = await CoursesService.create(req.body, req.admin);
      return sendCreated(res, created, 'Course created successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await CoursesService.update(req.params.id, req.body, req.admin);
      return sendSuccess(res, updated, 'Course updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await CoursesService.delete(req.params.id, req.admin);
      return sendSuccess(res, null, 'Course deleted successfully');
    } catch (error) {
      return next(error);
    }
  }
}
