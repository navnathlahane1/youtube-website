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
      $or: [
        { applicationDeadline: { $gte: new Date() } },
        { applicationDeadline: { $exists: false } },
        { applicationDeadline: null },
        { deadline: { $gte: new Date() } },
        { deadline: { $exists: false } },
        { deadline: null },
      ],
    };

    if (filters.branchId) filter.branchesAllowed = filters.branchId;
    if (filters.jobType) filter.jobType = filters.jobType;
    if (filters.workMode) filter.workMode = filters.workMode;
    if (filters.search) {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { title: { $regex: filters.search, $options: 'i' } },
          { companyName: { $regex: filters.search, $options: 'i' } },
          { location: { $regex: filters.search, $options: 'i' } },
          { eligibility: { $regex: filters.search, $options: 'i' } },
        ],
      });
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

    // Format items to guarantee backward-compatible fields
    const formattedItems = items.map((item: any) => ({
      ...item,
      salaryRange: item.salaryRange || item.salaryOrStipend || 'Best in Industry',
      salaryOrStipend: item.salaryOrStipend || item.salaryRange || 'Best in Industry',
      deadline: item.deadline || item.applicationDeadline,
      applicationDeadline: item.applicationDeadline || item.deadline,
      applicantsCount: item.clickCount || item.applicantsCount || 0,
    }));

    return { items: formattedItems, total, page, limit };
  }

  static async listAdmin(filters: JobQueryFilters, page = 1, limit = 100) {
    const filter: any = {};
    if (filters.status) filter.status = filters.status;
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
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      JobModel.countDocuments(filter),
    ]);

    const formattedItems = items.map((item: any) => ({
      ...item,
      salaryRange: item.salaryRange || item.salaryOrStipend || 'Best in Industry',
      salaryOrStipend: item.salaryOrStipend || item.salaryRange || 'Best in Industry',
      deadline: item.deadline || item.applicationDeadline,
      applicationDeadline: item.applicationDeadline || item.deadline,
      applicantsCount: item.clickCount || item.applicantsCount || 0,
    }));

    return { items: formattedItems, total, page, limit };
  }

  static async getBySlug(slug: string, incrementView = true) {
    const job = await JobModel.findOne({ slug: slug.toLowerCase() }).populate('branchesAllowed');
    if (!job) throw new NotFoundError('Job opening not found');

    if (incrementView) {
      job.viewCount += 1;
      await job.save();
    }

    const obj: any = job.toObject();
    obj.salaryRange = obj.salaryRange || obj.salaryOrStipend;
    obj.salaryOrStipend = obj.salaryOrStipend || obj.salaryRange;
    obj.deadline = obj.deadline || obj.applicationDeadline;
    obj.applicationDeadline = obj.applicationDeadline || obj.deadline;
    return obj;
  }

  static async trackApplyClick(id: string) {
    const job = await JobModel.findById(id);
    if (job) {
      job.clickCount += 1;
      job.applicantsCount = (job.applicantsCount || 0) + 1;
      await job.save();
    }
  }

  static async create(data: any, actor: any) {
    const title = data.title || 'Job Opening';
    const companyName = data.companyName || 'Company';
    let slug = data.slug ? slugify(data.slug) : slugify(`${companyName}-${title}`);
    const count = await JobModel.countDocuments({ slug: new RegExp(`^${slug}`) });
    if (count > 0) slug = `${slug}-${count + 1}`;

    const status = data.status || PUBLISHING_STATUS.PUBLISHED;
    const publishedAt = status === PUBLISHING_STATUS.PUBLISHED ? new Date() : undefined;

    const salary = data.salaryRange || data.salaryOrStipend || 'Best in Industry';
    const deadlineVal = data.applicationDeadline || data.deadline ? new Date(data.applicationDeadline || data.deadline) : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);

    const payload: any = {
      ...data,
      title,
      companyName,
      slug,
      salaryOrStipend: salary,
      salaryRange: salary,
      applicationDeadline: deadlineVal,
      deadline: deadlineVal,
      whatsappCommunityUrl: data.whatsappCommunityUrl || 'https://whatsapp.com/channel/0029Vb83otN1SWsvTKibxi1d?utm_source=chatgpt.com',
      status,
      publishedAt,
      createdBy: actor?.id,
      updatedBy: actor?.id,
    };

    const created = await JobModel.create(payload);

    if (actor?.id) {
      await AuditLogService.record({
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        action: 'CREATE',
        module: 'JOB',
        entityId: created._id.toString(),
        newValue: created.toObject(),
      }).catch(() => {});
    }

    return created;
  }

  static async update(id: string, data: any, actor: any) {
    const job = await JobModel.findById(id);
    if (!job) throw new NotFoundError('Job opening not found');

    const oldValue = job.toObject();
    if (data.status === PUBLISHING_STATUS.PUBLISHED && job.status !== PUBLISHING_STATUS.PUBLISHED) {
      data.publishedAt = new Date();
      data.publishedBy = actor?.id;
    }

    if (data.salaryRange || data.salaryOrStipend) {
      data.salaryOrStipend = data.salaryOrStipend || data.salaryRange;
      data.salaryRange = data.salaryRange || data.salaryOrStipend;
    }

    if (data.deadline || data.applicationDeadline) {
      const deadlineVal = new Date(data.deadline || data.applicationDeadline);
      data.deadline = deadlineVal;
      data.applicationDeadline = deadlineVal;
    }

    data.updatedBy = actor?.id;
    Object.assign(job, data);
    await job.save();

    if (actor?.id) {
      await AuditLogService.record({
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        action: 'UPDATE',
        module: 'JOB',
        entityId: id,
        oldValue,
        newValue: job.toObject(),
      }).catch(() => {});
    }

    return job;
  }

  static async updateStatus(id: string, status: PublishingStatus, actor: any) {
    return this.update(id, { status } as any, actor);
  }

  static async delete(id: string, actor: any) {
    const deleted = await JobModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundError('Job opening not found');

    if (actor?.id) {
      await AuditLogService.record({
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        action: 'DELETE',
        module: 'JOB',
        entityId: id,
        oldValue: deleted.toObject(),
      }).catch(() => {});
    }

    return deleted;
  }
}
