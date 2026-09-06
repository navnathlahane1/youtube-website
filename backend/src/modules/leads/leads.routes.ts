import { Router } from 'express';
import { LeadsController } from './leads.controller';
import { authMiddleware, requireRole } from '../../common/middleware/auth';
import { ADMIN_ROLES } from '../../common/constants';

const router = Router();

// Public submission
router.post('/submit', LeadsController.submitPublic);

// Admin routes
router.get('/metrics', authMiddleware, LeadsController.getMetrics);
router.get('/admin/all', authMiddleware, LeadsController.listAdmin);
router.get('/:id', authMiddleware, LeadsController.getById);
router.patch('/:id/status', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN, ADMIN_ROLES.EDITOR), LeadsController.updateStatus);
router.post('/:id/notes', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN, ADMIN_ROLES.EDITOR), LeadsController.addNote);
router.delete('/:id', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), LeadsController.delete);

export const leadsRoutes = router;
