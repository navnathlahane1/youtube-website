import { ProjectModel, IProject } from './projects.model';
import { NotFoundError } from '../../common/errors';
import { slugify } from '../../common/utils/slug';
import { PUBLISHING_STATUS, PublishingStatus } from '../../common/constants';
import { AuditLogService } from '../audit-logs/audit-logs.service';

export interface ProjectQueryFilters {
  branchId?: string;
  category?: string;
  tech?: string;
  difficulty?: string;
  search?: string;
  status?: string;
}

export class ProjectsService {
  static async listPublic(filters: ProjectQueryFilters, page = 1, limit = 12) {
    const filter: any = { status: PUBLISHING_STATUS.PUBLISHED };

    if (filters.branchId) filter.branchIds = filters.branchId;
    if (filters.category) filter.category = filters.category;
    if (filters.difficulty) filter.difficulty = filters.difficulty;
    if (filters.tech) filter.techStack = { $regex: filters.tech, $options: 'i' };
    if (filters.search) {
      filter.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { abstract: { $regex: filters.search, $options: 'i' } },
        { techStack: { $in: [new RegExp(filters.search, 'i')] } },
      ];
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      ProjectModel.find(filter)
        .populate('branchIds', 'name code')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ProjectModel.countDocuments(filter),
    ]);

    return { items, total, page, limit };
  }

  static async listAdmin(filters: ProjectQueryFilters, page = 1, limit = 20) {
    const filter: any = {};
    if (filters.status) filter.status = filters.status;
    if (filters.search) {
      filter.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { category: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      ProjectModel.find(filter)
        .populate('branchIds', 'name code')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ProjectModel.countDocuments(filter),
    ]);

    return { items, total, page, limit };
  }

  static async getBySlug(slug: string, incrementView = true) {
    const project = await ProjectModel.findOne({ slug: slug.toLowerCase() }).populate('branchIds');
    if (!project) throw new NotFoundError('Project idea not found');

    if (incrementView) {
      project.viewCount += 1;
      await project.save();
    }

    return project.toObject();
  }

  static async create(data: Partial<IProject>, actor: any) {
    let slug = slugify(data.title || 'project');
    const count = await ProjectModel.countDocuments({ slug: new RegExp(`^${slug}`) });
    if (count > 0) slug = `${slug}-${count + 1}`;

    const status = data.status || PUBLISHING_STATUS.DRAFT;
    const publishedAt = status === PUBLISHING_STATUS.PUBLISHED ? new Date() : undefined;

    const created = await ProjectModel.create({
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
      module: 'PROJECT',
      entityId: created._id.toString(),
      newValue: created.toObject(),
    });

    return created;
  }

  static async update(id: string, data: Partial<IProject>, actor: any) {
    const project = await ProjectModel.findById(id);
    if (!project) throw new NotFoundError('Project not found');

    const oldValue = project.toObject();
    if (data.status === PUBLISHING_STATUS.PUBLISHED && project.status !== PUBLISHING_STATUS.PUBLISHED) {
      data.publishedAt = new Date();
      data.publishedBy = actor.id;
    }

    data.updatedBy = actor.id;
    Object.assign(project, data);
    await project.save();

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'UPDATE',
      module: 'PROJECT',
      entityId: id,
      oldValue,
      newValue: project.toObject(),
    });

    return project;
  }

  static async updateStatus(id: string, status: PublishingStatus, actor: any) {
    return this.update(id, { status } as any, actor);
  }

  static async delete(id: string, actor: any) {
    const deleted = await ProjectModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundError('Project not found');

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'DELETE',
      module: 'PROJECT',
      entityId: id,
      oldValue: deleted.toObject(),
    });

    return deleted;
  }
}
