import { Router } from 'express';
import { SubjectsController } from './subjects.controller';
import { authMiddleware, requireRole } from '../../common/middleware/auth';
import { ADMIN_ROLES } from '../../common/constants';

const router = Router();

router.get('/', SubjectsController.list);
router.get('/hub/:slug', SubjectsController.getSubjectHub);
router.get('/:identifier', SubjectsController.getByIdOrSlug);

router.post('/', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), SubjectsController.create);
router.put('/:id', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), SubjectsController.update);
router.delete('/:id', authMiddleware, requireRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), SubjectsController.delete);

export const subjectsRoutes = router;
