import { AnnouncementModel, IAnnouncement } from './announcements.model';
import { NotFoundError } from '../../common/errors';
import { slugify } from '../../common/utils/slug';
import { PUBLISHING_STATUS } from '../../common/constants';
import { AuditLogService } from '../audit-logs/audit-logs.service';

export class AnnouncementsService {
  static async listPublic(category?: string) {
    const filter: any = { status: PUBLISHING_STATUS.PUBLISHED };
    if (category) filter.category = category;

    return AnnouncementModel.find(filter).sort({ priority: -1, createdAt: -1 }).lean();
  }

  static async listAdmin() {
    return AnnouncementModel.find().sort({ createdAt: -1 }).lean();
  }

  static async getBannerAlerts() {
    return AnnouncementModel.find({
      status: PUBLISHING_STATUS.PUBLISHED,
      bannerAlert: true,
    })
      .sort({ priority: -1, createdAt: -1 })
      .lean();
  }

  static async create(data: Partial<IAnnouncement>, actor: any) {
    let slug = slugify(data.title || 'announcement');
    const count = await AnnouncementModel.countDocuments({ slug: new RegExp(`^${slug}`) });
    if (count > 0) slug = `${slug}-${count + 1}`;

    const created = await AnnouncementModel.create({
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
      module: 'ANNOUNCEMENT',
      entityId: created._id.toString(),
      newValue: created.toObject(),
    });

    return created;
  }

  static async update(id: string, data: Partial<IAnnouncement>, actor: any) {
    const item = await AnnouncementModel.findById(id);
    if (!item) throw new NotFoundError('Announcement not found');

    const oldValue = item.toObject();
    data.updatedBy = actor.id;
    Object.assign(item, data);
    await item.save();

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'UPDATE',
      module: 'ANNOUNCEMENT',
      entityId: id,
      oldValue,
      newValue: item.toObject(),
    });

    return item;
  }

  static async delete(id: string, actor: any) {
    const deleted = await AnnouncementModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundError('Announcement not found');

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'DELETE',
      module: 'ANNOUNCEMENT',
      entityId: id,
      oldValue: deleted.toObject(),
    });

    return deleted;
  }
}
