import { Schema, model, Document, Types } from 'mongoose';
import { PUBLISHING_STATUS, PublishingStatus } from '../../common/constants';

export interface IAnnouncement extends Document {
  title: string;
  slug: string;
  category: 'EXAM_CIRCULAR' | 'BATCH_UPDATE' | 'SCHOLARSHIP_TEST' | 'GENERAL';
  content: string;
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  bannerAlert: boolean; // Show in top ticker / ribbon
  attachmentUrl?: string;
  status: PublishingStatus;
  publishedAt?: Date;
  expiresAt?: Date;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const announcementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    category: {
      type: String,
      enum: ['EXAM_CIRCULAR', 'BATCH_UPDATE', 'SCHOLARSHIP_TEST', 'GENERAL'],
      default: 'GENERAL',
      index: true,
    },
    content: { type: String, required: true, trim: true },
    priority: {
      type: String,
      enum: ['NORMAL', 'HIGH', 'URGENT'],
      default: 'NORMAL',
    },
    bannerAlert: { type: Boolean, default: false, index: true },
    attachmentUrl: { type: String },
    status: {
      type: String,
      enum: Object.values(PUBLISHING_STATUS),
      default: PUBLISHING_STATUS.DRAFT,
      index: true,
    },
    publishedAt: { type: Date },
    expiresAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  },
  {
    timestamps: true,
  }
);

export const AnnouncementModel = model<IAnnouncement>('Announcement', announcementSchema);
