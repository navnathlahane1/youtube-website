import { AdminModel, IAdmin } from './admins.model';
import { hashPassword } from '../../common/utils/password';
import { NotFoundError, ConflictError } from '../../common/errors';
import { AuditLogService } from '../audit-logs/audit-logs.service';

export class AdminsService {
  static async list() {
    return AdminModel.find().select('-passwordHash').sort({ createdAt: -1 }).lean();
  }

  static async getById(id: string) {
    const admin = await AdminModel.findById(id).select('-passwordHash').lean();
    if (!admin) throw new NotFoundError('Admin user not found');
    return admin;
  }

  static async create(data: { name: string; email: string; password: string; role: any }, actor: any) {
    const existing = await AdminModel.findOne({ email: data.email.toLowerCase() });
    if (existing) throw new ConflictError(`Admin with email '${data.email}' already exists`);

    const passwordHash = await hashPassword(data.password);
    const created = await AdminModel.create({
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      role: data.role,
      isActive: true,
    });

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'CREATE_ADMIN',
      module: 'ADMINS',
      entityId: created._id.toString(),
      newValue: { email: data.email, role: data.role },
    });

    return created;
  }

  static async update(id: string, data: Partial<IAdmin>, actor: any) {
    const admin = await AdminModel.findById(id);
    if (!admin) throw new NotFoundError('Admin user not found');

    const oldValue = admin.toObject();
    if (data.name) admin.name = data.name;
    if (data.role) admin.role = data.role;
    if (data.isActive !== undefined) admin.isActive = data.isActive;

    await admin.save();

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'UPDATE_ADMIN',
      module: 'ADMINS',
      entityId: id,
      oldValue,
      newValue: admin.toObject(),
    });

    return admin;
  }

  static async delete(id: string, actor: any) {
    const deleted = await AdminModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundError('Admin user not found');

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'DELETE_ADMIN',
      module: 'ADMINS',
      entityId: id,
      oldValue: deleted.toObject(),
    });

    return deleted;
  }
}
