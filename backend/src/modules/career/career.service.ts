import { CareerResourceModel, ICareerResource } from './career.model';
import { NotFoundError } from '../../common/errors';
import { slugify } from '../../common/utils/slug';
import { PUBLISHING_STATUS, PublishingStatus } from '../../common/constants';
import { AuditLogService } from '../audit-logs/audit-logs.service';

export class CareerService {
  static async listPublic(filters: { type?: string; domain?: string; search?: string }, page = 1, limit = 12) {
    const filter: any = { status: PUBLISHING_STATUS.PUBLISHED };
    if (filters.type) filter.type = filters.type;
    if (filters.domain) filter.domain = { $regex: filters.domain, $options: 'i' };
    if (filters.search) {
      filter.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { domain: { $regex: filters.search, $options: 'i' } },
        { summary: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      CareerResourceModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      CareerResourceModel.countDocuments(filter),
    ]);

    return { items, total, page, limit };
  }

  static async listAdmin(filters: { type?: string; status?: string; search?: string }, page = 1, limit = 20) {
    const filter: any = {};
    if (filters.type) filter.type = filters.type;
    if (filters.status) filter.status = filters.status;
    if (filters.search) {
      filter.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { domain: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      CareerResourceModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      CareerResourceModel.countDocuments(filter),
    ]);

    return { items, total, page, limit };
  }

  static async getBySlug(slug: string, incrementView = true) {
    const resource = await CareerResourceModel.findOne({ slug: slug.toLowerCase() });
    if (!resource) throw new NotFoundError('Career roadmap/resource not found');

    if (incrementView) {
      resource.viewCount += 1;
      await resource.save();
    }

    return resource.toObject();
  }

  static async create(data: Partial<ICareerResource>, actor: any) {
    let slug = slugify(data.title || 'roadmap');
    const count = await CareerResourceModel.countDocuments({ slug: new RegExp(`^${slug}`) });
    if (count > 0) slug = `${slug}-${count + 1}`;

    const created = await CareerResourceModel.create({
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
      module: 'CAREER',
      entityId: created._id.toString(),
      newValue: created.toObject(),
    });

    return created;
  }

  static async update(id: string, data: Partial<ICareerResource>, actor: any) {
    const resource = await CareerResourceModel.findById(id);
    if (!resource) throw new NotFoundError('Career resource not found');

    const oldValue = resource.toObject();
    if (data.status === PUBLISHING_STATUS.PUBLISHED && resource.status !== PUBLISHING_STATUS.PUBLISHED) {
      data.publishedAt = new Date();
      data.publishedBy = actor.id;
    }

    data.updatedBy = actor.id;
    Object.assign(resource, data);
    await resource.save();

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'UPDATE',
      module: 'CAREER',
      entityId: id,
      oldValue,
      newValue: resource.toObject(),
    });

    return resource;
  }

  static async updateStatus(id: string, status: PublishingStatus, actor: any) {
    return this.update(id, { status } as any, actor);
  }

  static async delete(id: string, actor: any) {
    const deleted = await CareerResourceModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundError('Career resource not found');

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'DELETE',
      module: 'CAREER',
      entityId: id,
      oldValue: deleted.toObject(),
    });

    return deleted;
  }
}
