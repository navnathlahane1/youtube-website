import { Request, Response, NextFunction } from 'express';
import { FacultyService } from './faculty.service';
import { sendSuccess, sendCreated } from '../../common/utils/response';
import { AuthenticatedRequest } from '../../common/types';

export class FacultyController {
  static async listPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const branchId = req.query.branchId as string | undefined;
      const items = await FacultyService.listPublic(branchId);
      return sendSuccess(res, items);
    } catch (error) {
      return next(error);
    }
  }

  static async listAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const items = await FacultyService.listAdmin();
      return sendSuccess(res, items);
    } catch (error) {
      return next(error);
    }
  }

  static async getByIdOrSlug(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await FacultyService.getByIdOrSlug(req.params.identifier);
      return sendSuccess(res, item);
    } catch (error) {
      return next(error);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const created = await FacultyService.create(req.body, req.admin);
      return sendCreated(res, created, 'Faculty profile created successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await FacultyService.update(req.params.id, req.body, req.admin);
      return sendSuccess(res, updated, 'Faculty profile updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await FacultyService.delete(req.params.id, req.admin);
      return sendSuccess(res, null, 'Faculty profile deleted successfully');
    } catch (error) {
      return next(error);
    }
  }
}
