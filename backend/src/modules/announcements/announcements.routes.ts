import { Router } from 'express';
import { AnnouncementsController } from './announcements.controller';
import { authMiddleware, requireRole } from '../../common/middleware/auth';
import { ADMIN_ROLES } from '../../common/constants';

const router = Router();

router.get('/', AnnouncementsController.listPublic);
router.get('/alerts/banner', AnnouncementsController.getBannerAlerts);

router.get('/admin/all', authMiddleware, AnnouncementsController.listAdmin);
router.post('/', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN, ADMIN_ROLES.EDITOR), AnnouncementsController.create);
router.put('/:id', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN, ADMIN_ROLES.EDITOR), AnnouncementsController.update);
router.delete('/:id', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), AnnouncementsController.delete);

export const announcementsRoutes = router;
