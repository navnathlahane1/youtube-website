import { CourseModel, ICourse } from './courses.model';
import { NotFoundError } from '../../common/errors';
import { slugify } from '../../common/utils/slug';
import { PUBLISHING_STATUS, PublishingStatus } from '../../common/constants';
import { AuditLogService } from '../audit-logs/audit-logs.service';

export class CoursesService {
  static async listPublic(filters: { branchId?: string; category?: string; featuredOnly?: boolean }) {
    const filter: any = { status: PUBLISHING_STATUS.PUBLISHED };
    if (filters.branchId) filter.targetBranches = filters.branchId;
    if (filters.category) filter.category = filters.category;
    if (filters.featuredOnly) filter.isFeatured = true;

    return CourseModel.find(filter)
      .populate('targetBranches', 'name code')
      .populate('facultyIds', 'name designation qualification photoUrl studentRating')
      .sort({ order: 1, createdAt: -1 })
      .lean();
  }

  static async listAdmin() {
    return CourseModel.find()
      .populate('targetBranches', 'name code')
      .populate('facultyIds', 'name designation')
      .sort({ order: 1, createdAt: -1 })
      .lean();
  }

  static async getBySlug(slug: string) {
    const course = await CourseModel.findOne({ slug: slug.toLowerCase() })
      .populate('targetBranches')
      .populate('facultyIds')
      .lean();

    if (!course) throw new NotFoundError('Course not found');
    return course;
  }

  static async create(data: Partial<ICourse>, actor: any) {
    let slug = slugify(data.title || 'course');
    const count = await CourseModel.countDocuments({ slug: new RegExp(`^${slug}`) });
    if (count > 0) slug = `${slug}-${count + 1}`;

    const created = await CourseModel.create({
      ...data,
      slug,
      status: data.status || PUBLISHING_STATUS.DRAFT,
      publishedAt: data.status === PUBLISHING_STATUS.PUBLISHED ? new Date() : undefined,
      createdBy: actor.id,
      updatedBy: actor.id,
    });

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'CREATE',
      module: 'COURSE',
      entityId: created._id.toString(),
      newValue: created.toObject(),
    });

    return created;
  }

  static async update(id: string, data: Partial<ICourse>, actor: any) {
    const course = await CourseModel.findById(id);
    if (!course) throw new NotFoundError('Course not found');

    const oldValue = course.toObject();
    if (data.status === PUBLISHING_STATUS.PUBLISHED && course.status !== PUBLISHING_STATUS.PUBLISHED) {
      data.publishedAt = new Date();
      data.publishedBy = actor.id;
    }

    data.updatedBy = actor.id;
    Object.assign(course, data);
    await course.save();

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'UPDATE',
      module: 'COURSE',
      entityId: id,
      oldValue,
      newValue: course.toObject(),
    });

    return course;
  }

  static async delete(id: string, actor: any) {
    const deleted = await CourseModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundError('Course not found');

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'DELETE',
      module: 'COURSE',
      entityId: id,
      oldValue: deleted.toObject(),
    });

    return deleted;
  }
}
