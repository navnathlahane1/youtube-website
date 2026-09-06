import { Router } from 'express';
import { EventsController } from './events.controller';
import { authMiddleware, requireRole } from '../../common/middleware/auth';
import { ADMIN_ROLES } from '../../common/constants';

const router = Router();

router.get('/', EventsController.listPublic);
router.get('/view/:slug', EventsController.getBySlug);
router.post('/register/:id', EventsController.register);

router.get('/admin/all', authMiddleware, EventsController.listAdmin);
router.post('/', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN, ADMIN_ROLES.EDITOR), EventsController.create);
router.put('/:id', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN, ADMIN_ROLES.EDITOR), EventsController.update);
router.delete('/:id', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), EventsController.delete);

export const eventsRoutes = router;
