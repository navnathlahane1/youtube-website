import { Response, NextFunction } from 'express';
import { AuditLogService } from './audit-logs.service';
import { sendPaginated } from '../../common/utils/response';
import { AuthenticatedRequest } from '../../common/types';

export class AuditLogsController {
  static async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 25;
      const { module, action, search } = req.query as any;

      const result = await AuditLogService.list({ module, action, search }, page, limit);
      return sendPaginated(res, result.logs, result.total, result.page, result.limit);
    } catch (error) {
      return next(error);
    }
  }
}
