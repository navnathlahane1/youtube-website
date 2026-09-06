import { Router } from 'express';
import { AcademicYearsController } from './academic-years.controller';
import { authMiddleware, requireRole } from '../../common/middleware/auth';
import { ADMIN_ROLES } from '../../common/constants';

const router = Router();

router.get('/', AcademicYearsController.list);
router.get('/:id', AcademicYearsController.getById);

// Admin mutations
router.post('/', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), AcademicYearsController.create);
router.put('/:id', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), AcademicYearsController.update);
router.delete('/:id', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), AcademicYearsController.delete);

export const academicYearsRoutes = router;
