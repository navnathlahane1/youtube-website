import { Router } from 'express';
import { NotesController } from './notes.controller';
import { authMiddleware, requireRole } from '../../common/middleware/auth';
import { ADMIN_ROLES } from '../../common/constants';

const router = Router();

// Public routes
router.get('/', NotesController.listPublic);
router.get('/view/:slug', NotesController.getBySlug);
router.post('/download/:id', NotesController.trackDownload);

// Admin routes
router.get('/admin/all', authMiddleware, NotesController.listAdmin);
router.post('/', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN, ADMIN_ROLES.EDITOR), NotesController.create);
router.put('/:id', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN, ADMIN_ROLES.EDITOR), NotesController.update);
router.patch('/:id/status', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), NotesController.updateStatus);
router.post('/admin/bulk-status', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), NotesController.bulkStatus);
router.delete('/:id', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), NotesController.delete);
router.post('/admin/bulk-delete', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), NotesController.bulkDelete);

export const notesRoutes = router;
