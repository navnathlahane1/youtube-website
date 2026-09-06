import { Request, Response, NextFunction } from 'express';
import { LeadsService } from './leads.service';
import { sendSuccess, sendCreated, sendPaginated } from '../../common/utils/response';
import { AuthenticatedRequest } from '../../common/types';
import { AnalyticsEventModel } from '../analytics/analytics.model';

export class LeadsController {
  static async submitPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const ip = req.ip || req.socket.remoteAddress;
      const created = await LeadsService.submitPublic(req.body, ip);

      AnalyticsEventModel.create({
        event: 'lead_submitted',
        resourceType: 'lead',
        resourceId: created._id.toString(),
        source: req.body.source || 'public_form',
        timestamp: new Date(),
      }).catch(() => {});

      return sendCreated(
        res,
        { id: created._id },
        'Thank you! Your demo class / counseling request has been received. Our counselor will contact you shortly.'
      );
    } catch (error) {
      return next(error);
    }
  }

  static async listAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      const { status, inquiryType, search } = req.query as any;

      const result = await LeadsService.listAdmin({ status, inquiryType, search }, page, limit);
      return sendPaginated(res, result.items, result.total, result.page, result.limit);
    } catch (error) {
      return next(error);
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const item = await LeadsService.getById(req.params.id);
      return sendSuccess(res, item);
    } catch (error) {
      return next(error);
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { status, nextFollowUpDate } = req.body;
      const updated = await LeadsService.updateStatus(req.params.id, status, nextFollowUpDate, req.admin);
      return sendSuccess(res, updated, 'Lead status updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async addNote(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { note } = req.body;
      const updated = await LeadsService.addNote(req.params.id, note, req.admin);
      return sendSuccess(res, updated, 'Note added to lead');
    } catch (error) {
      return next(error);
    }
  }

  static async getMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const metrics = await LeadsService.getMetrics();
      return sendSuccess(res, metrics);
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await LeadsService.delete(req.params.id, req.admin);
      return sendSuccess(res, null, 'Lead deleted successfully');
    } catch (error) {
      return next(error);
    }
  }
}
