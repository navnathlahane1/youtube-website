import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { AuthService } from '../../modules/auth/auth.service';
import { UnauthorizedError, ForbiddenError } from '../errors';
import { AdminRole } from '../constants';

export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    let token = req.cookies?.admin_session;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new UnauthorizedError('Authentication session required');
    }

    const validated = await AuthService.validateSessionToken(token);
    if (!validated) {
      throw new UnauthorizedError('Invalid or expired session');
    }

    req.admin = {
      id: validated.admin._id.toString(),
      email: validated.admin.email,
      name: validated.admin.name,
      role: validated.admin.role,
    };

    req.sessionData = {
      sessionId: validated.session._id.toString(),
      adminId: validated.admin._id.toString(),
      email: validated.admin.email,
      role: validated.admin.role,
      name: validated.admin.name,
    };

    return next();
  } catch (error) {
    return next(error);
  }
}

export function requireRole(...allowedRoles: AdminRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (!allowedRoles.includes(req.admin.role)) {
      return next(new ForbiddenError(`Forbidden: Role '${req.admin.role}' does not have required permissions`));
    }

    return next();
  };
}
