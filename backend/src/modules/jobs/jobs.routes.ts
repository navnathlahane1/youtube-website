import { Router } from 'express';
import { JobsController } from './jobs.controller';
import { authMiddleware, requireRole } from '../../common/middleware/auth';
import { ADMIN_ROLES } from '../../common/constants';

const router = Router();

router.get('/', JobsController.listPublic);
router.get('/view/:slug', JobsController.getBySlug);
router.post('/apply/:id', JobsController.trackApply);

router.get('/admin/all', authMiddleware, JobsController.listAdmin);
router.post('/', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN, ADMIN_ROLES.EDITOR), JobsController.create);
router.put('/:id', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN, ADMIN_ROLES.EDITOR), JobsController.update);
router.patch('/:id/status', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), JobsController.updateStatus);
router.delete('/:id', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), JobsController.delete);

export const jobsRoutes = router;
