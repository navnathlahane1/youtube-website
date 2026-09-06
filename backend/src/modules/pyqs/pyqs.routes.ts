import { Router } from 'express';
import { PYQsController } from './pyqs.controller';
import { authMiddleware, requireRole } from '../../common/middleware/auth';
import { ADMIN_ROLES } from '../../common/constants';

const router = Router();

// Public routes
router.get('/', PYQsController.listPublic);
router.get('/view/:slug', PYQsController.getBySlug);
router.post('/download/:id', PYQsController.trackDownload);

// Admin routes
router.get('/admin/all', authMiddleware, PYQsController.listAdmin);
router.post('/', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN, ADMIN_ROLES.EDITOR), PYQsController.create);
router.put('/:id', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN, ADMIN_ROLES.EDITOR), PYQsController.update);
router.patch('/:id/status', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), PYQsController.updateStatus);
router.post('/admin/bulk-status', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), PYQsController.bulkStatus);
router.delete('/:id', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), PYQsController.delete);
router.post('/admin/bulk-delete', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), PYQsController.bulkDelete);

export const pyqsRoutes = router;
