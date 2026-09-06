import { PYQModel, IPYQ } from './pyqs.model';
import { NotFoundError } from '../../common/errors';
import { slugify } from '../../common/utils/slug';
import { PUBLISHING_STATUS, PublishingStatus } from '../../common/constants';
import { AuditLogService } from '../audit-logs/audit-logs.service';

export interface PYQQueryFilters {
  branchId?: string;
  semesterId?: string;
  subjectId?: string;
  year?: number;
  difficulty?: string;
  search?: string;
  status?: string;
}

export class PYQsService {
  static async listPublic(filters: PYQQueryFilters, page = 1, limit = 20) {
    const filter: any = { status: PUBLISHING_STATUS.PUBLISHED };

    if (filters.branchId) filter.branchId = filters.branchId;
    if (filters.semesterId) filter.semesterId = filters.semesterId;
    if (filters.subjectId) filter.subjectId = filters.subjectId;
    if (filters.year) filter.year = filters.year;
    if (filters.difficulty) filter.difficulty = filters.difficulty;
    if (filters.search) {
      filter.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { examType: { $regex: filters.search, $options: 'i' } },
        { tags: { $in: [new RegExp(filters.search, 'i')] } },
      ];
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      PYQModel.find(filter)
        .populate('branchId', 'name code slug')
        .populate('semesterId', 'number name')
        .populate('subjectId', 'name code slug')
        .sort({ year: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      PYQModel.countDocuments(filter),
    ]);

    return { items, total, page, limit };
  }

  static async listAdmin(filters: PYQQueryFilters, page = 1, limit = 20, sortBy = 'createdAt', sortOrder: 'asc' | 'desc' = 'desc') {
    const filter: any = {};
    if (filters.status) filter.status = filters.status;
    if (filters.branchId) filter.branchId = filters.branchId;
    if (filters.semesterId) filter.semesterId = filters.semesterId;
    if (filters.subjectId) filter.subjectId = filters.subjectId;
    if (filters.year) filter.year = filters.year;
    if (filters.search) {
      filter.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { examType: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [items, total] = await Promise.all([
      PYQModel.find(filter)
        .populate('branchId', 'name code')
        .populate('semesterId', 'number name')
        .populate('subjectId', 'name code')
        .populate('createdBy', 'name email')
        .populate('publishedBy', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      PYQModel.countDocuments(filter),
    ]);

    return { items, total, page, limit };
  }

  static async getBySlug(slug: string, incrementView = true) {
    const pyq = await PYQModel.findOne({ slug: slug.toLowerCase() })
      .populate('branchId')
      .populate('semesterId')
      .populate('subjectId');

    if (!pyq) throw new NotFoundError('PYQ paper not found');

    if (incrementView) {
      pyq.viewCount += 1;
      await pyq.save();
    }

    return pyq.toObject();
  }

  static async incrementDownload(id: string) {
    const pyq = await PYQModel.findById(id);
    if (pyq) {
      pyq.downloadCount += 1;
      await pyq.save();
    }
  }

  static async create(data: Partial<IPYQ>, actor: any) {
    const slugBase = `${data.title}-${data.year}-${data.examType || 'exam'}`;
    let slug = slugify(slugBase);

    // Check slug collision
    const count = await PYQModel.countDocuments({ slug: new RegExp(`^${slug}`) });
    if (count > 0) slug = `${slug}-${count + 1}`;

    const status = data.status || PUBLISHING_STATUS.DRAFT;
    const publishedAt = status === PUBLISHING_STATUS.PUBLISHED ? new Date() : undefined;
    const publishedBy = status === PUBLISHING_STATUS.PUBLISHED ? actor.id : undefined;

    const created = await PYQModel.create({
      ...data,
      slug,
      status,
      publishedAt,
      publishedBy,
      createdBy: actor.id,
      updatedBy: actor.id,
    });

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'CREATE',
      module: 'PYQ',
      entityId: created._id.toString(),
      newValue: created.toObject(),
    });

    return created;
  }

  static async update(id: string, data: Partial<IPYQ>, actor: any) {
    const pyq = await PYQModel.findById(id);
    if (!pyq) throw new NotFoundError('PYQ paper not found');

    const oldValue = pyq.toObject();

    if (data.status === PUBLISHING_STATUS.PUBLISHED && pyq.status !== PUBLISHING_STATUS.PUBLISHED) {
      data.publishedAt = new Date();
      data.publishedBy = actor.id;
    }

    data.updatedBy = actor.id;
    Object.assign(pyq, data);
    await pyq.save();

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'UPDATE',
      module: 'PYQ',
      entityId: id,
      oldValue,
      newValue: pyq.toObject(),
    });

    return pyq;
  }

  static async updateStatus(id: string, status: PublishingStatus, actor: any) {
    return this.update(id, { status } as any, actor);
  }

  static async bulkUpdateStatus(ids: string[], status: PublishingStatus, actor: any) {
    const updateData: any = {
      status,
      updatedBy: actor.id,
    };
    if (status === PUBLISHING_STATUS.PUBLISHED) {
      updateData.publishedAt = new Date();
      updateData.publishedBy = actor.id;
    }

    await PYQModel.updateMany({ _id: { $in: ids } }, { $set: updateData });

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: `BULK_${status}`,
      module: 'PYQ',
      newValue: { ids, status },
    });
  }

  static async delete(id: string, actor: any) {
    const deleted = await PYQModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundError('PYQ paper not found');

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'DELETE',
      module: 'PYQ',
      entityId: id,
      oldValue: deleted.toObject(),
    });

    return deleted;
  }

  static async bulkDelete(ids: string[], actor: any) {
    await PYQModel.deleteMany({ _id: { $in: ids } });

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'BULK_DELETE',
      module: 'PYQ',
      oldValue: { ids },
    });
  }
}
