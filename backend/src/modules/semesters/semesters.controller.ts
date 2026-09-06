import { Request, Response, NextFunction } from 'express';
import { SemestersService } from './semesters.service';
import { sendSuccess, sendCreated } from '../../common/utils/response';
import { AuthenticatedRequest } from '../../common/types';

export class SemestersController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const academicYearId = req.query.academicYearId as string | undefined;
      const includeInactive = req.query.includeInactive === 'true';
      const items = await SemestersService.list({ academicYearId, includeInactive });
      return sendSuccess(res, items);
    } catch (error) {
      return next(error);
    }
  }

  static async getByIdOrSlug(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await SemestersService.getByIdOrSlug(req.params.identifier);
      return sendSuccess(res, item);
    } catch (error) {
      return next(error);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const created = await SemestersService.create(req.body, req.admin);
      return sendCreated(res, created, 'Semester created successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await SemestersService.update(req.params.id, req.body, req.admin);
      return sendSuccess(res, updated, 'Semester updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await SemestersService.delete(req.params.id, req.admin);
      return sendSuccess(res, null, 'Semester deleted successfully');
    } catch (error) {
      return next(error);
    }
  }
}
