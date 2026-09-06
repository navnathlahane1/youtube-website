import { Router } from 'express';
import { AuditLogsController } from './audit-logs.controller';
import { authMiddleware, requireRole } from '../../common/middleware/auth';
import { ADMIN_ROLES } from '../../common/constants';

const router = Router();

router.get('/', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), AuditLogsController.list);

export const auditLogsRoutes = router;
