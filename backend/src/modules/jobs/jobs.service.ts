import { JobModel, IJob } from './jobs.model';
import { NotFoundError } from '../../common/errors';
import { slugify } from '../../common/utils/slug';
import { PUBLISHING_STATUS, PublishingStatus } from '../../common/constants';
import { AuditLogService } from '../audit-logs/audit-logs.service';

export interface JobQueryFilters {
  branchId?: string;
  jobType?: string;
  workMode?: string;
  search?: string;
  status?: string;
  activeOnly?: boolean;
}

export class JobsService {
  static async listPublic(filters: JobQueryFilters, page = 1, limit = 12) {
    const filter: any = {
      status: PUBLISHING_STATUS.PUBLISHED,
      applicationDeadline: { $gte: new Date() }, // Active non-expired jobs
    };

    if (filters.branchId) filter.branchesAllowed = filters.branchId;
    if (filters.jobType) filter.jobType = filters.jobType;
    if (filters.workMode) filter.workMode = filters.workMode;
    if (filters.search) {
      filter.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { companyName: { $regex: filters.search, $options: 'i' } },
        { location: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      JobModel.find(filter)
        .populate('branchesAllowed', 'name code')
        .sort({ applicationDeadline: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      JobModel.countDocuments(filter),
    ]);

    return { items, total, page, limit };
  }

  static async listAdmin(filters: JobQueryFilters, page = 1, limit = 20) {
    const filter: any = {};
    if (filters.status) filter.status = filters.status;
    if (filters.search) {
      filter.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { companyName: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      JobModel.find(filter)
        .populate('branchesAllowed', 'name code')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      JobModel.countDocuments(filter),
    ]);

    return { items, total, page, limit };
  }

  static async getBySlug(slug: string, incrementView = true) {
    const job = await JobModel.findOne({ slug: slug.toLowerCase() }).populate('branchesAllowed');
    if (!job) throw new NotFoundError('Job opening not found');

    if (incrementView) {
      job.viewCount += 1;
      await job.save();
    }

    return job.toObject();
  }

  static async trackApplyClick(id: string) {
    const job = await JobModel.findById(id);
    if (job) {
      job.clickCount += 1;
      await job.save();
    }
  }

  static async create(data: Partial<IJob>, actor: any) {
    let slug = slugify(`${data.title}-${data.companyName}`);
    const count = await JobModel.countDocuments({ slug: new RegExp(`^${slug}`) });
    if (count > 0) slug = `${slug}-${count + 1}`;

    const status = data.status || PUBLISHING_STATUS.DRAFT;
    const publishedAt = status === PUBLISHING_STATUS.PUBLISHED ? new Date() : undefined;

    const created = await JobModel.create({
      ...data,
      slug,
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
      module: 'JOB',
      entityId: created._id.toString(),
      newValue: created.toObject(),
    });

    return created;
  }

  static async update(id: string, data: Partial<IJob>, actor: any) {
    const job = await JobModel.findById(id);
    if (!job) throw new NotFoundError('Job opening not found');

    const oldValue = job.toObject();
    if (data.status === PUBLISHING_STATUS.PUBLISHED && job.status !== PUBLISHING_STATUS.PUBLISHED) {
      data.publishedAt = new Date();
      data.publishedBy = actor.id;
    }

    data.updatedBy = actor.id;
    Object.assign(job, data);
    await job.save();

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'UPDATE',
      module: 'JOB',
      entityId: id,
      oldValue,
      newValue: job.toObject(),
    });

    return job;
  }

  static async updateStatus(id: string, status: PublishingStatus, actor: any) {
    return this.update(id, { status } as any, actor);
  }

  static async delete(id: string, actor: any) {
    const deleted = await JobModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundError('Job opening not found');

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'DELETE',
      module: 'JOB',
      entityId: id,
      oldValue: deleted.toObject(),
    });

    return deleted;
  }
}
