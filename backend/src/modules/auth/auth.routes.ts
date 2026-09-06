import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../common/middleware/validate';
import { loginSchema, changePasswordSchema } from './auth.schema';
import { authMiddleware } from '../../common/middleware/auth';

const router = Router();

router.post('/login', validate({ body: loginSchema }), AuthController.login);
router.get('/me', authMiddleware, AuthController.me);
router.post('/logout', authMiddleware, AuthController.logout);
router.post('/change-password', authMiddleware, validate({ body: changePasswordSchema }), AuthController.changePassword);

export const authRoutes = router;
