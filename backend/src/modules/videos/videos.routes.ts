import { Router } from 'express';
import { VideosController } from './videos.controller';
import { authMiddleware, requireRole } from '../../common/middleware/auth';
import { ADMIN_ROLES } from '../../common/constants';

const router = Router();

router.get('/', VideosController.listPublic);
router.get('/view/:slug', VideosController.getBySlug);

router.get('/admin/all', authMiddleware, VideosController.listAdmin);
router.post('/', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN, ADMIN_ROLES.EDITOR), VideosController.create);
router.put('/:id', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN, ADMIN_ROLES.EDITOR), VideosController.update);
router.patch('/:id/status', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), VideosController.updateStatus);
router.delete('/:id', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), VideosController.delete);

export const videosRoutes = router;
