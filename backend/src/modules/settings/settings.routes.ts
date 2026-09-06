import { Router } from 'express';
import { SettingsController } from './settings.controller';
import { authMiddleware, requireRole } from '../../common/middleware/auth';
import { ADMIN_ROLES } from '../../common/constants';

const router = Router();

router.get('/', SettingsController.getPublic);
router.put('/', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN), SettingsController.update);

export const settingsRoutes = router;
