import { SubjectModel, ISubject } from './subjects.model';
import { PYQModel } from '../pyqs/pyqs.model';
import { NoteModel } from '../notes/notes.model';
import { VideoModel } from '../videos/videos.model';
import { NotFoundError, ConflictError } from '../../common/errors';
import { slugify } from '../../common/utils/slug';
import { PUBLISHING_STATUS } from '../../common/constants';
import { AuditLogService } from '../audit-logs/audit-logs.service';

export interface SubjectListQuery {
  branchId?: string;
  semesterId?: string;
  search?: string;
  includeInactive?: boolean;
}

export class SubjectsService {
  static async list(query: SubjectListQuery) {
    const filter: any = {};
    if (!query.includeInactive) filter.isActive = true;
    if (query.branchId) filter.branchId = query.branchId;
    if (query.semesterId) filter.semesterId = query.semesterId;
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { code: { $regex: query.search, $options: 'i' } },
      ];
    }

    return SubjectModel.find(filter)
      .populate('branchId', 'name code slug')
      .populate('semesterId', 'number name slug')
      .sort({ order: 1, name: 1 })
      .lean();
  }

  static async getByIdOrSlug(identifier: string) {
    const query = identifier.match(/^[0-9a-fA-F]{24}$/) ? { _id: identifier } : { slug: identifier.toLowerCase() };
    const subject = await SubjectModel.findOne(query)
      .populate('branchId')
      .populate('semesterId')
      .lean();

    if (!subject) throw new NotFoundError('Subject not found');
    return subject;
  }

  static async getSubjectWithResources(slug: string) {
    const subject = await SubjectModel.findOne({ slug: slug.toLowerCase(), isActive: true })
      .populate('branchId')
      .populate('semesterId')
      .lean();

    if (!subject) throw new NotFoundError('Subject not found');

    const [pyqs, notes, videos] = await Promise.all([
      PYQModel.find({ subjectId: subject._id, status: PUBLISHING_STATUS.PUBLISHED }).sort({ year: -1 }).lean(),
      NoteModel.find({ subjectId: subject._id, status: PUBLISHING_STATUS.PUBLISHED }).sort({ unitNumber: 1 }).lean(),
      VideoModel.find({ subjectId: subject._id, status: PUBLISHING_STATUS.PUBLISHED }).sort({ unitNumber: 1 }).lean(),
    ]);

    return {
      subject,
      resources: {
        pyqs,
        notes,
        videos,
        totalPYQs: pyqs.length,
        totalNotes: notes.length,
        totalVideos: videos.length,
      },
    };
  }

  static async create(data: Partial<ISubject>, actor?: any) {
    const slug = data.slug ? slugify(data.slug) : slugify(`${data.name}-${data.code}`);
    const existing = await SubjectModel.findOne({
      branchId: data.branchId,
      code: data.code?.toUpperCase(),
    });
    if (existing) {
      throw new ConflictError(`Subject with code '${data.code}' already exists for this branch`);
    }

    const created = await SubjectModel.create({
      ...data,
      code: data.code?.toUpperCase(),
      slug,
    });

    if (actor) {
      await AuditLogService.record({
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        action: 'CREATE',
        module: 'SUBJECT',
        entityId: created._id.toString(),
        newValue: created.toObject(),
      });
    }

    return created;
  }

  static async update(id: string, data: Partial<ISubject>, actor?: any) {
    const existing = await SubjectModel.findById(id);
    if (!existing) throw new NotFoundError('Subject not found');

    const oldValue = existing.toObject();
    if (data.code) data.code = data.code.toUpperCase();
    if (data.name && !data.slug) data.slug = slugify(`${data.name}-${existing.code}`);

    Object.assign(existing, data);
    await existing.save();

    if (actor) {
      await AuditLogService.record({
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        action: 'UPDATE',
        module: 'SUBJECT',
        entityId: id,
        oldValue,
        newValue: existing.toObject(),
      });
    }

    return existing;
  }

  static async delete(id: string, actor?: any) {
    const deleted = await SubjectModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundError('Subject not found');

    if (actor) {
      await AuditLogService.record({
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        action: 'DELETE',
        module: 'SUBJECT',
        entityId: id,
        oldValue: deleted.toObject(),
      });
    }

    return deleted;
  }
}
