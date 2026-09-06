import { Request, Response, NextFunction } from 'express';
import { EventsService } from './events.service';
import { sendSuccess, sendCreated } from '../../common/utils/response';
import { AuthenticatedRequest } from '../../common/types';

export class EventsController {
  static async listPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const upcomingOnly = req.query.upcoming !== 'false';
      const items = await EventsService.listPublic(upcomingOnly);
      return sendSuccess(res, items);
    } catch (error) {
      return next(error);
    }
  }

  static async listAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const items = await EventsService.listAdmin();
      return sendSuccess(res, items);
    } catch (error) {
      return next(error);
    }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await EventsService.getBySlug(req.params.slug);
      return sendSuccess(res, item);
    } catch (error) {
      return next(error);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await EventsService.registerForEvent(req.params.id);
      return sendSuccess(res, updated, 'Registration successful');
    } catch (error) {
      return next(error);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const created = await EventsService.create(req.body, req.admin);
      return sendCreated(res, created, 'Event created successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await EventsService.update(req.params.id, req.body, req.admin);
      return sendSuccess(res, updated, 'Event updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await EventsService.delete(req.params.id, req.admin);
      return sendSuccess(res, null, 'Event deleted successfully');
    } catch (error) {
      return next(error);
    }
  }
}
