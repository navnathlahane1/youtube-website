import { EventModel, IEvent } from './events.model';
import { NotFoundError } from '../../common/errors';
import { slugify } from '../../common/utils/slug';
import { PUBLISHING_STATUS } from '../../common/constants';
import { AuditLogService } from '../audit-logs/audit-logs.service';

export class EventsService {
  static async listPublic(upcomingOnly = true) {
    const filter: any = { status: PUBLISHING_STATUS.PUBLISHED };
    if (upcomingOnly) {
      filter.endDate = { $gte: new Date() };
    }

    return EventModel.find(filter).sort({ startDate: 1 }).lean();
  }

  static async listAdmin() {
    return EventModel.find().sort({ startDate: -1 }).lean();
  }

  static async getBySlug(slug: string) {
    const event = await EventModel.findOne({ slug: slug.toLowerCase() }).lean();
    if (!event) throw new NotFoundError('Event not found');
    return event;
  }

  static async registerForEvent(id: string) {
    const event = await EventModel.findById(id);
    if (!event) throw new NotFoundError('Event not found');
    if (!event.registrationOpen) throw new Error('Registration is closed for this event');
    if (event.registrationLimit && event.registeredCount >= event.registrationLimit) {
      throw new Error('This event has reached its maximum seat capacity');
    }

    event.registeredCount += 1;
    await event.save();
    return event;
  }

  static async create(data: Partial<IEvent>, actor: any) {
    let slug = slugify(data.title || 'event');
    const count = await EventModel.countDocuments({ slug: new RegExp(`^${slug}`) });
    if (count > 0) slug = `${slug}-${count + 1}`;

    const created = await EventModel.create({
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
      module: 'EVENT',
      entityId: created._id.toString(),
      newValue: created.toObject(),
    });

    return created;
  }

  static async update(id: string, data: Partial<IEvent>, actor: any) {
    const event = await EventModel.findById(id);
    if (!event) throw new NotFoundError('Event not found');

    const oldValue = event.toObject();
    data.updatedBy = actor.id;
    Object.assign(event, data);
    await event.save();

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'UPDATE',
      module: 'EVENT',
      entityId: id,
      oldValue,
      newValue: event.toObject(),
    });

    return event;
  }

  static async delete(id: string, actor: any) {
    const deleted = await EventModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundError('Event not found');

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'DELETE',
      module: 'EVENT',
      entityId: id,
      oldValue: deleted.toObject(),
    });

    return deleted;
  }
}
