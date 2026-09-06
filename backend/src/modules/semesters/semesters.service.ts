import { SemesterModel, ISemester } from './semesters.model';
import { NotFoundError, ConflictError } from '../../common/errors';
import { slugify } from '../../common/utils/slug';
import { AuditLogService } from '../audit-logs/audit-logs.service';

export class SemestersService {
  static async list(query: { academicYearId?: string; includeInactive?: boolean }) {
    const filter: any = {};
    if (!query.includeInactive) filter.isActive = true;
    if (query.academicYearId) filter.academicYearId = query.academicYearId;

    return SemesterModel.find(filter)
      .populate('academicYearId', 'name code order')
      .sort({ number: 1 })
      .lean();
  }

  static async getByIdOrSlug(identifier: string) {
    const query = identifier.match(/^[0-9a-fA-F]{24}$/) ? { _id: identifier } : { slug: identifier.toLowerCase() };
    const item = await SemesterModel.findOne(query).populate('academicYearId').lean();
    if (!item) throw new NotFoundError('Semester not found');
    return item;
  }

  static async create(data: Partial<ISemester>, actor?: any) {
    const slug = data.slug ? slugify(data.slug) : `sem-${data.number}`;
    const existing = await SemesterModel.findOne({ $or: [{ number: data.number }, { slug }] });
    if (existing) throw new ConflictError(`Semester ${data.number} or slug '${slug}' already exists`);

    const created = await SemesterModel.create({
      ...data,
      slug,
    });

    if (actor) {
      await AuditLogService.record({
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        action: 'CREATE',
        module: 'SEMESTER',
        entityId: created._id.toString(),
        newValue: created.toObject(),
      });
    }

    return created;
  }

  static async update(id: string, data: Partial<ISemester>, actor?: any) {
    const existing = await SemesterModel.findById(id);
    if (!existing) throw new NotFoundError('Semester not found');

    const oldValue = existing.toObject();
    if (data.number && !data.slug) data.slug = `sem-${data.number}`;

    Object.assign(existing, data);
    await existing.save();

    if (actor) {
      await AuditLogService.record({
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        action: 'UPDATE',
        module: 'SEMESTER',
        entityId: id,
        oldValue,
        newValue: existing.toObject(),
      });
    }

    return existing;
  }

  static async delete(id: string, actor?: any) {
    const deleted = await SemesterModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundError('Semester not found');

    if (actor) {
      await AuditLogService.record({
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        action: 'DELETE',
        module: 'SEMESTER',
        entityId: id,
        oldValue: deleted.toObject(),
      });
    }

    return deleted;
  }
}
