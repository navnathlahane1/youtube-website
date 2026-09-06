import { Schema, model, Document, Types } from 'mongoose';

export interface IAuditLog extends Document {
  actorId?: Types.ObjectId;
  actorEmail?: string;
  actorRole?: string;
  action: string;
  module: string;
  entityId?: string;
  oldValue?: any;
  newValue?: any;
  ip?: string;
  userAgent?: string;
  timestamp: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    actorId: { type: Schema.Types.ObjectId, ref: 'Admin', index: true },
    actorEmail: { type: String, index: true },
    actorRole: { type: String },
    action: { type: String, required: true, index: true }, // e.g., 'CREATE', 'UPDATE', 'DELETE', 'PUBLISH', 'ARCHIVE', 'LOGIN'
    module: { type: String, required: true, index: true }, // e.g., 'PYQ', 'NOTE', 'BRANCH', 'AUTH'
    entityId: { type: String, index: true },
    oldValue: { type: Schema.Types.Mixed },
    newValue: { type: Schema.Types.Mixed },
    ip: { type: String },
    userAgent: { type: String },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: false,
  }
);

// Compound index for timeline filtering
auditLogSchema.index({ module: 1, timestamp: -1 });

export const AuditLogModel = model<IAuditLog>('AuditLog', auditLogSchema);
