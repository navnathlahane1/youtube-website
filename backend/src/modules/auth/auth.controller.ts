import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { AuthenticatedRequest } from '../../common/types';
import { sendSuccess } from '../../common/utils/response';
import { env } from '../../config/env';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const meta = {
        ip: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
      };

      const { token, admin } = await AuthService.login(email, password, meta);

      // Set secure session cookie
      res.cookie('admin_session', token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: env.SESSION_MAX_AGE_DAYS * 24 * 60 * 60 * 1000,
        domain: env.COOKIE_DOMAIN || undefined,
        path: '/',
      });

      return sendSuccess(
        res,
        {
          token, // also return token for mobile / testing clients
          admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
          },
        },
        'Logged in successfully'
      );
    } catch (error) {
      return next(error);
    }
  }

  static async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, {
        admin: req.admin,
        session: req.sessionData,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async logout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      let token = req.cookies?.admin_session;
      if (!token && req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
      }

      if (token) {
        await AuthService.logout(token, req.admin?.id, {
          ip: req.ip || req.socket.remoteAddress,
          userAgent: req.headers['user-agent'],
        });
      }

      res.clearCookie('admin_session', {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        domain: env.COOKIE_DOMAIN || undefined,
        path: '/',
      });

      return sendSuccess(res, null, 'Logged out successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { currentPassword, newPassword } = req.body;
      await AuthService.changePassword(req.admin!.id, currentPassword, newPassword);
      return sendSuccess(res, null, 'Password updated successfully. Please re-login on other devices.');
    } catch (error) {
      return next(error);
    }
  }
}
