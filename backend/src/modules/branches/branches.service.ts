import { BranchModel, IBranch } from './branches.model';
import { NotFoundError, ConflictError } from '../../common/errors';
import { slugify } from '../../common/utils/slug';
import { AuditLogService } from '../audit-logs/audit-logs.service';

export class BranchesService {
  static async list(includeInactive = false) {
    const filter = includeInactive ? {} : { isActive: true };
    return BranchModel.find(filter).sort({ order: 1 }).lean();
  }

  static async getByIdOrSlug(identifier: string) {
    const query = identifier.match(/^[0-9a-fA-F]{24}$/) ? { _id: identifier } : { slug: identifier.toLowerCase() };
    const item = await BranchModel.findOne(query).lean();
    if (!item) throw new NotFoundError('Branch not found');
    return item;
  }

  static async create(data: Partial<IBranch>, actor?: any) {
    const slug = data.slug ? slugify(data.slug) : slugify(data.name || data.code || '');
    const existing = await BranchModel.findOne({
      $or: [{ code: data.code?.toUpperCase() }, { slug }],
    });
    if (existing) throw new ConflictError('Branch code or slug already exists');

    const created = await BranchModel.create({
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
        module: 'BRANCH',
        entityId: created._id.toString(),
        newValue: created.toObject(),
      });
    }

    return created;
  }

  static async update(id: string, data: Partial<IBranch>, actor?: any) {
    const existing = await BranchModel.findById(id);
    if (!existing) throw new NotFoundError('Branch not found');

    const oldValue = existing.toObject();
    if (data.name && !data.slug) data.slug = slugify(data.name);
    if (data.code) data.code = data.code.toUpperCase();

    Object.assign(existing, data);
    await existing.save();

    if (actor) {
      await AuditLogService.record({
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        action: 'UPDATE',
        module: 'BRANCH',
        entityId: id,
        oldValue,
        newValue: existing.toObject(),
      });
    }

    return existing;
  }

  static async delete(id: string, actor?: any) {
    const deleted = await BranchModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundError('Branch not found');

    if (actor) {
      await AuditLogService.record({
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        action: 'DELETE',
        module: 'BRANCH',
        entityId: id,
        oldValue: deleted.toObject(),
      });
    }

    return deleted;
  }
}
