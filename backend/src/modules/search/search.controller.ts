import { Request, Response, NextFunction } from 'express';
import { SearchService } from './search.service';
import { sendSuccess } from '../../common/utils/response';
import { AnalyticsEventModel } from '../analytics/analytics.model';

export class SearchController {
  static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const q = req.query.q as string | undefined;
      const type = req.query.type as string | undefined;
      const branchId = req.query.branchId as string | undefined;
      const semesterId = req.query.semesterId as string | undefined;
      const subjectId = req.query.subjectId as string | undefined;
      const difficulty = req.query.difficulty as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

      const results = await SearchService.search({
        q,
        type,
        branchId,
        semesterId,
        subjectId,
        difficulty,
        limit,
      });

      // Asynchronously track search analytics if query provided
      if (q && q.trim().length > 1) {
        AnalyticsEventModel.create({
          event: 'search',
          searchQuery: q.trim(),
          source: (req.query.source as string) || 'search_bar',
          timestamp: new Date(),
        }).catch(() => {});
      }

      return sendSuccess(res, results);
    } catch (error) {
      return next(error);
    }
  }
}
