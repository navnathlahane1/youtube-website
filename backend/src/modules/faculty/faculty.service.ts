import { FacultyModel, IFaculty } from './faculty.model';
import { NotFoundError } from '../../common/errors';
import { slugify } from '../../common/utils/slug';
import { AuditLogService } from '../audit-logs/audit-logs.service';

export class FacultyService {
  static async listPublic(branchId?: string) {
    const filter: any = { isActive: true };
    if (branchId) filter.specializationBranches = branchId;

    return FacultyModel.find(filter)
      .populate('specializationBranches', 'name code')
      .sort({ order: 1, createdAt: 1 })
      .lean();
  }

  static async listAdmin() {
    return FacultyModel.find()
      .populate('specializationBranches', 'name code')
      .sort({ order: 1, createdAt: 1 })
      .lean();
  }

  static async getByIdOrSlug(identifier: string) {
    const query = identifier.match(/^[0-9a-fA-F]{24}$/) ? { _id: identifier } : { slug: identifier.toLowerCase() };
    const faculty = await FacultyModel.findOne(query).populate('specializationBranches').lean();
    if (!faculty) throw new NotFoundError('Faculty member not found');
    return faculty;
  }

  static async create(data: Partial<IFaculty>, actor?: any) {
    let slug = slugify(data.name || 'faculty');
    const count = await FacultyModel.countDocuments({ slug: new RegExp(`^${slug}`) });
    if (count > 0) slug = `${slug}-${count + 1}`;

    const created = await FacultyModel.create({
      ...data,
      slug,
    });

    if (actor) {
      await AuditLogService.record({
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        action: 'CREATE',
        module: 'FACULTY',
        entityId: created._id.toString(),
        newValue: created.toObject(),
      });
    }

    return created;
  }

  static async update(id: string, data: Partial<IFaculty>, actor?: any) {
    const faculty = await FacultyModel.findById(id);
    if (!faculty) throw new NotFoundError('Faculty member not found');

    const oldValue = faculty.toObject();
    Object.assign(faculty, data);
    await faculty.save();

    if (actor) {
      await AuditLogService.record({
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        action: 'UPDATE',
        module: 'FACULTY',
        entityId: id,
        oldValue,
        newValue: faculty.toObject(),
      });
    }

    return faculty;
  }

  static async delete(id: string, actor?: any) {
    const deleted = await FacultyModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundError('Faculty member not found');

    if (actor) {
      await AuditLogService.record({
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        action: 'DELETE',
        module: 'FACULTY',
        entityId: id,
        oldValue: deleted.toObject(),
      });
    }

    return deleted;
  }
}
