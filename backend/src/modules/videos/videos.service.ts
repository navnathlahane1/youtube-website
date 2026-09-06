import { VideoModel, IVideo } from './videos.model';
import { NotFoundError } from '../../common/errors';
import { slugify } from '../../common/utils/slug';
import { PUBLISHING_STATUS, PublishingStatus } from '../../common/constants';
import { AuditLogService } from '../audit-logs/audit-logs.service';

export interface VideoQueryFilters {
  branchId?: string;
  semesterId?: string;
  subjectId?: string;
  unitNumber?: number;
  search?: string;
  status?: string;
}

export class VideosService {
  static async listPublic(filters: VideoQueryFilters, page = 1, limit = 20) {
    const filter: any = { status: PUBLISHING_STATUS.PUBLISHED };

    if (filters.branchId) filter.branchId = filters.branchId;
    if (filters.semesterId) filter.semesterId = filters.semesterId;
    if (filters.subjectId) filter.subjectId = filters.subjectId;
    if (filters.unitNumber) filter.unitNumber = filters.unitNumber;
    if (filters.search) {
      filter.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { instructorName: { $regex: filters.search, $options: 'i' } },
        { tags: { $in: [new RegExp(filters.search, 'i')] } },
      ];
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      VideoModel.find(filter)
        .populate('branchId', 'name code slug')
        .populate('semesterId', 'number name')
        .populate('subjectId', 'name code slug')
        .sort({ unitNumber: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      VideoModel.countDocuments(filter),
    ]);

    return { items, total, page, limit };
  }

  static async listAdmin(filters: VideoQueryFilters, page = 1, limit = 20, sortBy = 'createdAt', sortOrder: 'asc' | 'desc' = 'desc') {
    const filter: any = {};
    if (filters.status) filter.status = filters.status;
    if (filters.branchId) filter.branchId = filters.branchId;
    if (filters.semesterId) filter.semesterId = filters.semesterId;
    if (filters.subjectId) filter.subjectId = filters.subjectId;
    if (filters.search) {
      filter.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { instructorName: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [items, total] = await Promise.all([
      VideoModel.find(filter)
        .populate('branchId', 'name code')
        .populate('semesterId', 'number name')
        .populate('subjectId', 'name code')
        .populate('createdBy', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      VideoModel.countDocuments(filter),
    ]);

    return { items, total, page, limit };
  }

  static async getBySlug(slug: string, incrementView = true) {
    const video = await VideoModel.findOne({ slug: slug.toLowerCase() })
      .populate('branchId')
      .populate('semesterId')
      .populate('subjectId');

    if (!video) throw new NotFoundError('Video lecture not found');

    if (incrementView) {
      video.viewCount += 1;
      await video.save();
    }

    return video.toObject();
  }

  static async create(data: Partial<IVideo>, actor: any) {
    let slug = slugify(data.title || 'video');
    const count = await VideoModel.countDocuments({ slug: new RegExp(`^${slug}`) });
    if (count > 0) slug = `${slug}-${count + 1}`;

    const status = data.status || PUBLISHING_STATUS.DRAFT;
    const publishedAt = status === PUBLISHING_STATUS.PUBLISHED ? new Date() : undefined;

    // Auto-generate thumbnail if YouTube URL
    let thumbnailUrl = data.thumbnailUrl;
    if (!thumbnailUrl && data.youtubeId) {
      thumbnailUrl = `https://img.youtube.com/vi/${data.youtubeId}/hqdefault.jpg`;
    }

    const created = await VideoModel.create({
      ...data,
      slug,
      thumbnailUrl,
      status,
      publishedAt,
      createdBy: actor.id,
      updatedBy: actor.id,
    });

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'CREATE',
      module: 'VIDEO',
      entityId: created._id.toString(),
      newValue: created.toObject(),
    });

    return created;
  }

  static async update(id: string, data: Partial<IVideo>, actor: any) {
    const video = await VideoModel.findById(id);
    if (!video) throw new NotFoundError('Video not found');

    const oldValue = video.toObject();
    if (data.status === PUBLISHING_STATUS.PUBLISHED && video.status !== PUBLISHING_STATUS.PUBLISHED) {
      data.publishedAt = new Date();
      data.publishedBy = actor.id;
    }

    data.updatedBy = actor.id;
    Object.assign(video, data);
    await video.save();

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'UPDATE',
      module: 'VIDEO',
      entityId: id,
      oldValue,
      newValue: video.toObject(),
    });

    return video;
  }

  static async updateStatus(id: string, status: PublishingStatus, actor: any) {
    return this.update(id, { status } as any, actor);
  }

  static async delete(id: string, actor: any) {
    const deleted = await VideoModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundError('Video not found');

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'DELETE',
      module: 'VIDEO',
      entityId: id,
      oldValue: deleted.toObject(),
    });

    return deleted;
  }
}
