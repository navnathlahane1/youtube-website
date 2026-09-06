import { AuditLogModel } from './audit-logs.model';
import { logger } from '../../config/logger';

export interface CreateAuditLogParams {
  actorId?: string;
  actorEmail?: string;
  actorRole?: string;
  action: string;
  module: string;
  entityId?: string;
  oldValue?: any;
  newValue?: any;
  ip?: string;
  userAgent?: string;
}

export class AuditLogService {
  static async record(params: CreateAuditLogParams) {
    try {
      await AuditLogModel.create({
        actorId: params.actorId,
        actorEmail: params.actorEmail,
        actorRole: params.actorRole,
        action: params.action,
        module: params.module,
        entityId: params.entityId,
        oldValue: params.oldValue,
        newValue: params.newValue,
        ip: params.ip,
        userAgent: params.userAgent,
        timestamp: new Date(),
      });
    } catch (err) {
      logger.error('Failed to write audit log entry:', err);
    }
  }

  static async list(query: { module?: string; action?: string; search?: string }, page = 1, limit = 20) {
    const filter: any = {};
    if (query.module) filter.module = query.module;
    if (query.action) filter.action = query.action;
    if (query.search) {
      filter.$or = [
        { actorEmail: { $regex: query.search, $options: 'i' } },
        { action: { $regex: query.search, $options: 'i' } },
        { module: { $regex: query.search, $options: 'i' } },
        { entityId: { $regex: query.search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      AuditLogModel.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limit).lean(),
      AuditLogModel.countDocuments(filter),
    ]);

    return { logs, total, page, limit };
  }
}
