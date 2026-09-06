import { Schema, model, Document, Types } from 'mongoose';
import { PUBLISHING_STATUS, PublishingStatus } from '../../common/constants';

export interface IJob extends Document {
  title: string;
  slug: string;
  companyName: string;
  companyLogoUrl?: string;
  jobType: 'FULL_TIME' | 'INTERNSHIP' | 'APPRENTICESHIP' | 'CORE_DRIVE';
  location: string;
  workMode: 'ON_SITE' | 'HYBRID' | 'REMOTE';
  salaryOrStipend: string; // e.g. "8-12 LPA", "₹35,000 / month"
  batchEligible: string[]; // e.g. ["2025", "2026"]
  branchesAllowed: Types.ObjectId[]; // Branches
  minCgpa?: number;
  applicationDeadline: Date;
  applyUrl: string;
  description: string;
  requirements: string[];
  selectionRounds: string[];
  status: PublishingStatus;
  publishedAt?: Date;
  viewCount: number;
  clickCount: number;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  publishedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    companyName: { type: String, required: true, trim: true },
    companyLogoUrl: { type: String },
    jobType: {
      type: String,
      enum: ['FULL_TIME', 'INTERNSHIP', 'APPRENTICESHIP', 'CORE_DRIVE'],
      default: 'FULL_TIME',
      index: true,
    },
    location: { type: String, required: true, trim: true },
    workMode: {
      type: String,
      enum: ['ON_SITE', 'HYBRID', 'REMOTE'],
      default: 'ON_SITE',
    },
    salaryOrStipend: { type: String, required: true, trim: true },
    batchEligible: [{ type: String, trim: true }],
    branchesAllowed: [{ type: Schema.Types.ObjectId, ref: 'Branch' }],
    minCgpa: { type: Number },
    applicationDeadline: { type: Date, required: true, index: true },
    applyUrl: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    requirements: [{ type: String, trim: true }],
    selectionRounds: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: Object.values(PUBLISHING_STATUS),
      default: PUBLISHING_STATUS.DRAFT,
      index: true,
    },
    publishedAt: { type: Date, index: true },
    viewCount: { type: Number, default: 0 },
    clickCount: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    publishedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ title: 'text', companyName: 'text', description: 'text' });

export const JobModel = model<IJob>('Job', jobSchema);
