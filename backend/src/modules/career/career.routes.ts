import { Router } from 'express';
import { CareerController } from './career.controller';
import { authMiddleware, requireRole } from '../../common/middleware/auth';
import { ADMIN_ROLES } from '../../common/constants';

const router = Router();

router.get('/', CareerController.listPublic);
router.get('/view/:slug', CareerController.getBySlug);

router.get('/admin/all', authMiddleware, CareerController.listAdmin);
router.post('/', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN, ADMIN_ROLES.EDITOR), CareerController.create);
router.put('/:id', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN, ADMIN_ROLES.EDITOR), CareerController.update);
router.patch('/:id/status', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), CareerController.updateStatus);
router.delete('/:id', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), CareerController.delete);

export const careerRoutes = router;
