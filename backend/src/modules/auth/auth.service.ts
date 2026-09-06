import { AdminModel, IAdmin } from '../admins/admins.model';
import { AdminSessionModel, IAdminSession } from './sessions.model';
import { verifyPassword, hashPassword } from '../../common/utils/password';
import { generateSecureToken, hashToken } from '../../common/utils/crypto';
import { UnauthorizedError, BadRequestError } from '../../common/errors';
import { AuditLogService } from '../audit-logs/audit-logs.service';
import { env } from '../../config/env';

export class AuthService {
  static async login(
    email: string,
    pass: string,
    meta: { ip?: string; userAgent?: string }
  ): Promise<{ token: string; admin: IAdmin; session: IAdminSession }> {
    const admin = await AdminModel.findOne({ email: email.toLowerCase() });

    if (!admin) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!admin.isActive) {
      throw new UnauthorizedError('Account is disabled. Please contact the administrator.');
    }

    // Check account lockout
    if (admin.lockUntil && admin.lockUntil > new Date()) {
      const waitMinutes = Math.ceil((admin.lockUntil.getTime() - Date.now()) / (1000 * 60));
      throw new BadRequestError(`Account temporarily locked due to failed attempts. Try again in ${waitMinutes} minutes.`);
    }

    const isValidPassword = await verifyPassword(admin.passwordHash, pass);

    if (!isValidPassword) {
      admin.loginAttempts += 1;
      if (admin.loginAttempts >= 5) {
        admin.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins lock
      }
      await admin.save();
      throw new UnauthorizedError('Invalid email or password');
    }

    // Reset failed attempts & record last login
    admin.loginAttempts = 0;
    admin.lockUntil = undefined;
    admin.lastLoginAt = new Date();
    await admin.save();

    // Generate secure session token
    const token = generateSecureToken(32);
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + env.SESSION_MAX_AGE_DAYS * 24 * 60 * 60 * 1000);

    const session = await AdminSessionModel.create({
      adminId: admin._id,
      tokenHash,
      ip: meta.ip,
      userAgent: meta.userAgent,
      expiresAt,
      isValid: true,
      lastUsedAt: new Date(),
    });

    await AuditLogService.record({
      actorId: admin._id.toString(),
      actorEmail: admin.email,
      actorRole: admin.role,
      action: 'LOGIN',
      module: 'AUTH',
      ip: meta.ip,
      userAgent: meta.userAgent,
    });

    return { token, admin, session };
  }

  static async validateSessionToken(token: string): Promise<{ admin: IAdmin; session: IAdminSession } | null> {
    const tokenHash = hashToken(token);
    const session = await AdminSessionModel.findOne({
      tokenHash,
      isValid: true,
      expiresAt: { $gt: new Date() },
    });

    if (!session) return null;

    const admin = await AdminModel.findById(session.adminId);
    if (!admin || !admin.isActive) {
      session.isValid = false;
      await session.save();
      return null;
    }

    // Update last used timestamp
    session.lastUsedAt = new Date();
    await session.save();

    return { admin, session };
  }

  static async logout(token: string, adminId?: string, meta?: { ip?: string; userAgent?: string }) {
    const tokenHash = hashToken(token);
    await AdminSessionModel.findOneAndUpdate({ tokenHash }, { isValid: false });

    if (adminId) {
      await AuditLogService.record({
        actorId: adminId,
        action: 'LOGOUT',
        module: 'AUTH',
        ip: meta?.ip,
        userAgent: meta?.userAgent,
      });
    }
  }

  static async revokeAllSessions(adminId: string) {
    await AdminSessionModel.updateMany({ adminId }, { isValid: false });
  }

  static async changePassword(adminId: string, currentPass: string, newPass: string) {
    const admin = await AdminModel.findById(adminId);
    if (!admin) throw new UnauthorizedError('Admin not found');

    const isValid = await verifyPassword(admin.passwordHash, currentPass);
    if (!isValid) throw new BadRequestError('Current password does not match');

    admin.passwordHash = await hashPassword(newPass);
    await admin.save();

    // Revoke all existing sessions for security except current
    await AdminSessionModel.updateMany({ adminId }, { isValid: false });

    await AuditLogService.record({
      actorId: adminId,
      actorEmail: admin.email,
      actorRole: admin.role,
      action: 'CHANGE_PASSWORD',
      module: 'AUTH',
    });
  }
}
