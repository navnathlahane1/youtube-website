import { Request, Response, NextFunction } from 'express';
import { AcademicYearsService } from './academic-years.service';
import { sendSuccess, sendCreated } from '../../common/utils/response';
import { AuthenticatedRequest } from '../../common/types';

export class AcademicYearsController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const items = await AcademicYearsService.list(includeInactive);
      return sendSuccess(res, items);
    } catch (error) {
      return next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await AcademicYearsService.getById(req.params.id);
      return sendSuccess(res, item);
    } catch (error) {
      return next(error);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const created = await AcademicYearsService.create(req.body, req.admin);
      return sendCreated(res, created, 'Academic year created successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await AcademicYearsService.update(req.params.id, req.body, req.admin);
      return sendSuccess(res, updated, 'Academic year updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await AcademicYearsService.delete(req.params.id, req.admin);
      return sendSuccess(res, null, 'Academic year deleted successfully');
    } catch (error) {
      return next(error);
    }
  }
}
