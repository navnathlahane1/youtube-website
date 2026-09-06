import { Request, Response, NextFunction } from 'express';
import { SubjectsService } from './subjects.service';
import { sendSuccess, sendCreated } from '../../common/utils/response';
import { AuthenticatedRequest } from '../../common/types';

export class SubjectsController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const branchId = req.query.branchId as string | undefined;
      const semesterId = req.query.semesterId as string | undefined;
      const search = req.query.search as string | undefined;
      const includeInactive = req.query.includeInactive === 'true';

      const items = await SubjectsService.list({ branchId, semesterId, search, includeInactive });
      return sendSuccess(res, items);
    } catch (error) {
      return next(error);
    }
  }

  static async getByIdOrSlug(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await SubjectsService.getByIdOrSlug(req.params.identifier);
      return sendSuccess(res, item);
    } catch (error) {
      return next(error);
    }
  }

  static async getSubjectHub(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await SubjectsService.getSubjectWithResources(req.params.slug);
      return sendSuccess(res, data);
    } catch (error) {
      return next(error);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const created = await SubjectsService.create(req.body, req.admin);
      return sendCreated(res, created, 'Subject created successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await SubjectsService.update(req.params.id, req.body, req.admin);
      return sendSuccess(res, updated, 'Subject updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await SubjectsService.delete(req.params.id, req.admin);
      return sendSuccess(res, null, 'Subject deleted successfully');
    } catch (error) {
      return next(error);
    }
  }
}
