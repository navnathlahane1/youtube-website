import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service';
import { sendSuccess } from '../../common/utils/response';
import { AuthenticatedRequest } from '../../common/types';

export class AnalyticsController {
  static async track(req: Request, res: Response, next: NextFunction) {
    try {
      await AnalyticsService.track(req.body);
      return sendSuccess(res, null, 'Event recorded');
    } catch (error) {
      return next(error);
    }
  }

  static async getDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await AnalyticsService.getDashboardOverview();
      return sendSuccess(res, data);
    } catch (error) {
      return next(error);
    }
  }
}
