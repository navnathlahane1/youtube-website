import { Schema, model, Document, Types } from 'mongoose';
import { PUBLISHING_STATUS, PublishingStatus } from '../../common/constants';

export interface INote extends Document {
  title: string;
  slug: string;
  subjectId: Types.ObjectId;
  branchId: Types.ObjectId;
  semesterId: Types.ObjectId;
  unitNumber?: number;
  unitTitle?: string;
  authorName?: string; // e.g. "Prof. Sharma", "Toppers handwritten"
  fileUrl: string; // PDF link
  fileSizeBytes?: number;
  pageCount?: number;
  isHandwritten: boolean;
  isFormulaSheet: boolean;
  status: PublishingStatus;
  publishedAt?: Date;
  scheduledPublishAt?: Date;
  viewCount: number;
  downloadCount: number;
  tags: string[];
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  publishedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    semesterId: { type: Schema.Types.ObjectId, ref: 'Semester', required: true, index: true },
    unitNumber: { type: Number },
    unitTitle: { type: String, trim: true },
    authorName: { type: String, trim: true },
    fileUrl: { type: String, required: true },
    fileSizeBytes: { type: Number },
    pageCount: { type: Number },
    isHandwritten: { type: Boolean, default: false },
    isFormulaSheet: { type: Boolean, default: false },
    status: {
      type: String,
      enum: Object.values(PUBLISHING_STATUS),
      default: PUBLISHING_STATUS.DRAFT,
      index: true,
    },
    publishedAt: { type: Date, index: true },
    scheduledPublishAt: { type: Date },
    viewCount: { type: Number, default: 0 },
    downloadCount: { type: Number, default: 0 },
    tags: [{ type: String, trim: true }],
    description: { type: String, trim: true },
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    publishedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  },
  {
    timestamps: true,
  }
);

noteSchema.index({ branchId: 1, semesterId: 1, subjectId: 1, status: 1 });
noteSchema.index({ title: 'text', description: 'text', tags: 'text' });

export const NoteModel = model<INote>('Note', noteSchema);
