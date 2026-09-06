import { AcademicYearModel, IAcademicYear } from './academic-years.model';
import { NotFoundError, ConflictError } from '../../common/errors';
import { AuditLogService } from '../audit-logs/audit-logs.service';

export class AcademicYearsService {
  static async list(includeInactive = false) {
    const filter = includeInactive ? {} : { isActive: true };
    return AcademicYearModel.find(filter).sort({ order: 1 }).lean();
  }

  static async getById(id: string) {
    const item = await AcademicYearModel.findById(id).lean();
    if (!item) throw new NotFoundError('Academic year not found');
    return item;
  }

  static async create(data: Partial<IAcademicYear>, actor?: any) {
    const existing = await AcademicYearModel.findOne({ code: data.code?.toUpperCase() });
    if (existing) throw new ConflictError(`Academic year code '${data.code}' already exists`);

    const created = await AcademicYearModel.create({
      ...data,
      code: data.code?.toUpperCase(),
    });

    if (actor) {
      await AuditLogService.record({
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        action: 'CREATE',
        module: 'ACADEMIC_YEAR',
        entityId: created._id.toString(),
        newValue: created.toObject(),
      });
    }

    return created;
  }

  static async update(id: string, data: Partial<IAcademicYear>, actor?: any) {
    const existing = await AcademicYearModel.findById(id);
    if (!existing) throw new NotFoundError('Academic year not found');

    const oldValue = existing.toObject();
    Object.assign(existing, data);
    if (data.code) existing.code = data.code.toUpperCase();
    await existing.save();

    if (actor) {
      await AuditLogService.record({
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        action: 'UPDATE',
        module: 'ACADEMIC_YEAR',
        entityId: id,
        oldValue,
        newValue: existing.toObject(),
      });
    }

    return existing;
  }

  static async delete(id: string, actor?: any) {
    const deleted = await AcademicYearModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundError('Academic year not found');

    if (actor) {
      await AuditLogService.record({
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        action: 'DELETE',
        module: 'ACADEMIC_YEAR',
        entityId: id,
        oldValue: deleted.toObject(),
      });
    }

    return deleted;
  }
}
