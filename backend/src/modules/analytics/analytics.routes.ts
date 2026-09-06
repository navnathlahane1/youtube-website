import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { authMiddleware } from '../../common/middleware/auth';

const router = Router();

router.post('/track', AnalyticsController.track);
router.get('/dashboard', authMiddleware, AnalyticsController.getDashboard);

export const analyticsRoutes = router;
