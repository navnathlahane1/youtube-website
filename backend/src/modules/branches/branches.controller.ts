import { Request, Response, NextFunction } from 'express';
import { BranchesService } from './branches.service';
import { sendSuccess, sendCreated } from '../../common/utils/response';
import { AuthenticatedRequest } from '../../common/types';

export class BranchesController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const items = await BranchesService.list(includeInactive);
      return sendSuccess(res, items);
    } catch (error) {
      return next(error);
    }
  }

  static async getByIdOrSlug(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await BranchesService.getByIdOrSlug(req.params.identifier);
      return sendSuccess(res, item);
    } catch (error) {
      return next(error);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const created = await BranchesService.create(req.body, req.admin);
      return sendCreated(res, created, 'Branch created successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await BranchesService.update(req.params.id, req.body, req.admin);
      return sendSuccess(res, updated, 'Branch updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await BranchesService.delete(req.params.id, req.admin);
      return sendSuccess(res, null, 'Branch deleted successfully');
    } catch (error) {
      return next(error);
    }
  }
}
