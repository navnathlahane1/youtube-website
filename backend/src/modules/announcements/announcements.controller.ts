import { Request, Response, NextFunction } from 'express';
import { AnnouncementsService } from './announcements.service';
import { sendSuccess, sendCreated } from '../../common/utils/response';
import { AuthenticatedRequest } from '../../common/types';

export class AnnouncementsController {
  static async listPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const category = req.query.category as string | undefined;
      const items = await AnnouncementsService.listPublic(category);
      return sendSuccess(res, items);
    } catch (error) {
      return next(error);
    }
  }

  static async getBannerAlerts(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await AnnouncementsService.getBannerAlerts();
      return sendSuccess(res, items);
    } catch (error) {
      return next(error);
    }
  }

  static async listAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const items = await AnnouncementsService.listAdmin();
      return sendSuccess(res, items);
    } catch (error) {
      return next(error);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const created = await AnnouncementsService.create(req.body, req.admin);
      return sendCreated(res, created, 'Announcement created successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await AnnouncementsService.update(req.params.id, req.body, req.admin);
      return sendSuccess(res, updated, 'Announcement updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await AnnouncementsService.delete(req.params.id, req.admin);
      return sendSuccess(res, null, 'Announcement deleted successfully');
    } catch (error) {
      return next(error);
    }
  }
}
