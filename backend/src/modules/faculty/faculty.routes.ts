import { Router } from 'express';
import { FacultyController } from './faculty.controller';
import { authMiddleware, requireRole } from '../../common/middleware/auth';
import { ADMIN_ROLES } from '../../common/constants';

const router = Router();

router.get('/', FacultyController.listPublic);
router.get('/:identifier', FacultyController.getByIdOrSlug);

router.get('/admin/all', authMiddleware, FacultyController.listAdmin);
router.post('/', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), FacultyController.create);
router.put('/:id', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), FacultyController.update);
router.delete('/:id', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), FacultyController.delete);

export const facultyRoutes = router;
