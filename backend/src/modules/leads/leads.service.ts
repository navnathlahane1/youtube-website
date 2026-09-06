import { LeadModel, ILead } from './leads.model';
import { NotFoundError } from '../../common/errors';
import { LEAD_STATUS, LeadStatus } from '../../common/constants';
import { AuditLogService } from '../audit-logs/audit-logs.service';

export interface LeadQueryFilters {
  status?: string;
  inquiryType?: string;
  search?: string;
}

export class LeadsService {
  static async submitPublic(data: Partial<ILead>, ip?: string) {
    const lead = await LeadModel.create({
      ...data,
      ipAddress: ip,
      status: LEAD_STATUS.NEW,
    });
    return lead;
  }

  static async listAdmin(filters: LeadQueryFilters, page = 1, limit = 20) {
    const filter: any = {};
    if (filters.status) filter.status = filters.status;
    if (filters.inquiryType) filter.inquiryType = filters.inquiryType;
    if (filters.search) {
      filter.$or = [
        { fullName: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
        { phone: { $regex: filters.search, $options: 'i' } },
        { collegeName: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      LeadModel.find(filter)
        .populate('interestedCourseId', 'title category')
        .populate('assignedCounselorId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      LeadModel.countDocuments(filter),
    ]);

    return { items, total, page, limit };
  }

  static async getById(id: string) {
    const lead = await LeadModel.findById(id)
      .populate('interestedCourseId')
      .populate('assignedCounselorId', 'name email')
      .lean();

    if (!lead) throw new NotFoundError('Lead not found');
    return lead;
  }

  static async updateStatus(id: string, status: LeadStatus, nextFollowUpDate?: Date, actor?: any) {
    const lead = await LeadModel.findById(id);
    if (!lead) throw new NotFoundError('Lead not found');

    const oldStatus = lead.status;
    lead.status = status;
    if (nextFollowUpDate) lead.nextFollowUpDate = nextFollowUpDate;
    await lead.save();

    if (actor) {
      await AuditLogService.record({
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        action: 'UPDATE_LEAD_STATUS',
        module: 'LEAD',
        entityId: id,
        oldValue: { status: oldStatus },
        newValue: { status, nextFollowUpDate },
      });
    }

    return lead;
  }

  static async addNote(id: string, noteText: string, actor: any) {
    const lead = await LeadModel.findById(id);
    if (!lead) throw new NotFoundError('Lead not found');

    lead.notes.push({
      note: noteText,
      authorEmail: actor.email,
      createdAt: new Date(),
    });

    await lead.save();
    return lead;
  }

  static async delete(id: string, actor: any) {
    const deleted = await LeadModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundError('Lead not found');

    await AuditLogService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'DELETE',
      module: 'LEAD',
      entityId: id,
      oldValue: deleted.toObject(),
    });

    return deleted;
  }

  static async getMetrics() {
    const [total, newCount, contacted, interested, converted, lost] = await Promise.all([
      LeadModel.countDocuments(),
      LeadModel.countDocuments({ status: LEAD_STATUS.NEW }),
      LeadModel.countDocuments({ status: LEAD_STATUS.CONTACTED }),
      LeadModel.countDocuments({ status: LEAD_STATUS.INTERESTED }),
      LeadModel.countDocuments({ status: LEAD_STATUS.CONVERTED }),
      LeadModel.countDocuments({ status: LEAD_STATUS.LOST }),
    ]);

    const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : '0.0';

    return {
      total,
      new: newCount,
      contacted,
      interested,
      converted,
      lost,
      conversionRate: `${conversionRate}%`,
    };
  }
}
