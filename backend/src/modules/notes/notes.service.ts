import { NoteModel, INote } from './notes.model';
import { NotFoundError } from '../../common/errors';
import { slugify } from '../../common/utils/slug';
import { PUBLISHING_STATUS, PublishingStatus } from '../../common/constants';
import { AuditLogService } from '../audit-logs/audit-logs.service';

export interface NoteQueryFilters {
  branchId?: string;
  semesterId?: string;
  subjectId?: string;
  unitNumber?: number;
  isHandwritten?: boolean;
  search?: string;
  status?: string;
}

export class NotesService {
  static async listPublic(filters: NoteQueryFilters, page = 1, limit = 20) {
    const filter: any = { status: PUBLISHING_STATUS.PUBLISHED };

    if (filters.branchId) filter.branchId = filters.branchId;
    if (filters.semesterId) filter.semesterId = filters.semesterId;
    if (filters.subjectId) filter.subjectId = filters.subjectId;
    if (filters.unitNumber) filter.unitNumber = filters.unitNumber;
    if (filters.isHandwritten !== undefined) filter.isHandwritten = filters.isHandwritten;
    if (filters.search) {
      filter.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { authorName: { $regex: filters.search, $options: 'i' } },
        { unitTitle: { $regex: filters.search, $options: 'i' } },
        { tags: { $in: [new RegExp(filters.search, 'i')] } },
      ];
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      NoteModel.find(filter)
        .populate('branchId', 'name code slug')
        .populate('semesterId', 'number name')
        .populate('subjectId', 'name code slug')
        .sort({ unitNumber: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      NoteModel.countDocuments(filter),
    ]);

    return { items, total, page, limit };
  }

  static async listAdmin(filters: NoteQueryFilters, page = 1, limit = 20, sortBy = 'createdAt', sortOrder: 'asc' | 'desc' = 'desc') {
    const filter: any = {};
    if (filters.status) filter.status = filters.status;
    if (filters.branchId) filter.branchId = filters.branchId;
    if (filters.semesterId) filter.semesterId = filters.semesterId;
    if (filters.subjectId) filter.subjectId = filters.subjectId;
    if (filters.search) {
      filter.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { authorName: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [items, total] = await Promise.all([
      NoteModel.find(filter)
        .populate('branchId', 'name code')
        .populate('semesterId', 'number name')
        .populate('subjectId', 'name code')
        .populate('createdBy', 'name email')
        .populate('publishedBy', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      NoteModel.countDocuments(filter),
    ]);

    return { items, total, page, limit };
  }

  static async getBySlug(slug: string, incrementView = true) {
    const note = await NoteModel.findOne({ slug: slug.toLowerCase() })
      .populate('branchId')
      .populate('semesterId')
      .populate('subjectId');

    if (!note) throw new NotFoundError('Note not found');

    if (incrementView) {
      note.viewCount += 1;
      await note.save();
    }

    return note.toObject();
  }

  static async incrementDownload(id: string) {
    const note = await NoteModel.findById(id);
    if (note) {
      note.downloadCount += 1;
      await note.save();
    }
  }

  static async create(data: Partial<INote>, actor: any) {
    if (!data.fileUrl || data.fileUrl.trim() === '') {
      throw new BadRequestError('Please provide or upload a PDF document file');
    }
    if (!data.branchId || (data.branchId as any) === '') {
      throw new BadRequestError('Please select an Engineering Branch in Academic Classification tab');
    }
    if (!data.semesterId || (data.semesterId as any) === '') {
      throw new BadRequestError('Please select a Semester in Academic Classification tab');
    }
    if (!data.subjectId || (data.subjectId as any) === '') {
      throw new BadRequestError('Please select a Subject in Academic Classification tab');
    }

    const slugBase = `${data.title}-unit-${data.unitNumber || 1}`;
    let slug = slugify(slugBase);

    const count = await NoteModel.countDocuments({ slug: new RegExp(`^${slug}`) });
    if (count > 0) slug = `${slug}-${count + 1}`;

    const status = data.status || PUBLISHING_STATUS.DRAFT;
    const publishedAt = status === PUBLISHING_STATUS.PUBLISHED ? new Date() : undefined;
    const publishedBy = status === PUBLISHING_STATUS.PUBLISHED ? actor.id : undefined;

    const created = await NoteModel.create({
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
      module: 'NOTE',
      entityId: created._id.toString(),
      newValue: created.toObject(),
    });

    return created;
  }

  static async update(id: string, data: Partial<INote>, actor: any) {
    const note = await NoteModel.findById(id);
    if (!note) throw new NotFoundError('Note not found');

    const oldValue = note.toObject();

    if (data.status === PUBLISHING_STATUS.PUBLISHED && note.status !== PUBLISHING_STATUS.PUBLISHED) {
      data.publishedAt = new Date();
      data.publishedBy = actor.id;
    }

    data.updatedBy = actor.id;
    Object.assign(note, data);
    await note.save();

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'UPDATE',
      module: 'NOTE',
      entityId: id,
      oldValue,
      newValue: note.toObject(),
    });

    return note;
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

    await NoteModel.updateMany({ _id: { $in: ids } }, { $set: updateData });

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: `BULK_${status}`,
      module: 'NOTE',
      newValue: { ids, status },
    });
  }

  static async delete(id: string, actor: any) {
    const deleted = await NoteModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundError('Note not found');

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'DELETE',
      module: 'NOTE',
      entityId: id,
      oldValue: deleted.toObject(),
    });

    return deleted;
  }

  static async bulkDelete(ids: string[], actor: any) {
    await NoteModel.deleteMany({ _id: { $in: ids } });

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'BULK_DELETE',
      module: 'NOTE',
      oldValue: { ids },
    });
  }
}
