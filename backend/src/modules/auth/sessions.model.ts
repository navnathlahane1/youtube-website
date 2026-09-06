import { Schema, model, Document, Types } from 'mongoose';

export interface IAdminSession extends Document {
  adminId: Types.ObjectId;
  tokenHash: string;
  userAgent?: string;
  ip?: string;
  isValid: boolean;
  expiresAt: Date;
  lastUsedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const adminSessionSchema = new Schema<IAdminSession>(
  {
    adminId: { type: Schema.Types.ObjectId, ref: 'Admin', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true, index: true },
    userAgent: { type: String },
    ip: { type: String },
    isValid: { type: Boolean, default: true, index: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL index
    lastUsedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const AdminSessionModel = model<IAdminSession>('AdminSession', adminSessionSchema);
