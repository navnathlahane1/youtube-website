import { Router } from 'express';
import { AdminsController } from './admins.controller';
import { authMiddleware, requireRole } from '../../common/middleware/auth';
import { ADMIN_ROLES } from '../../common/constants';

const router = Router();

router.use(authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN));

router.get('/', AdminsController.list);
router.get('/:id', AdminsController.getById);
router.post('/', AdminsController.create);
router.put('/:id', AdminsController.update);
router.delete('/:id', AdminsController.delete);

export const adminsRoutes = router;
