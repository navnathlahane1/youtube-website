import { Schema, model, Document, Types } from 'mongoose';
import { PUBLISHING_STATUS, PublishingStatus } from '../../common/constants';

export interface IJob extends Document {
  title: string;
  slug: string;
  companyName: string;
  companyLogoUrl?: string;
  jobType: 'FULL_TIME' | 'INTERNSHIP' | 'APPRENTICESHIP' | 'CORE_DRIVE' | 'OFF_CAMPUS' | 'CONTRACT' | 'REMOTE_INTERN';
  location: string;
  workMode: 'ON_SITE' | 'HYBRID' | 'REMOTE';
  salaryOrStipend: string;
  salaryRange?: string;
  batchEligible: string[]; // e.g. ["2024", "2025", "2026", "Freshers", "Experienced"]
  eligibility?: string;
  branchesAllowed: Types.ObjectId[];
  minCgpa?: number;
  applicationDeadline?: Date;
  deadline?: Date;
  applyUrl: string;
  whatsappCommunityUrl?: string;
  description: string;
  requirements: string[];
  selectionRounds: string[];
  tags: string[];
  status: PublishingStatus;
  publishedAt?: Date;
  viewCount: number;
  clickCount: number;
  applicantsCount?: number;
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
      enum: ['FULL_TIME', 'INTERNSHIP', 'APPRENTICESHIP', 'CORE_DRIVE', 'OFF_CAMPUS', 'CONTRACT', 'REMOTE_INTERN'],
      default: 'FULL_TIME',
      index: true,
    },
    location: { type: String, default: 'Pan India / Remote', trim: true },
    workMode: {
      type: String,
      enum: ['ON_SITE', 'HYBRID', 'REMOTE'],
      default: 'HYBRID',
    },
    salaryOrStipend: { type: String, default: 'Best in Industry', trim: true },
    salaryRange: { type: String, default: 'Best in Industry', trim: true },
    batchEligible: [{ type: String, trim: true }],
    eligibility: { type: String, trim: true },
    branchesAllowed: [{ type: Schema.Types.ObjectId, ref: 'Branch' }],
    minCgpa: { type: Number },
    applicationDeadline: { type: Date, index: true },
    deadline: { type: Date },
    applyUrl: { type: String, required: true, trim: true },
    whatsappCommunityUrl: {
      type: String,
      default: 'https://whatsapp.com/channel/0029Vb83otN1SWsvTKibxi1d?utm_source=chatgpt.com',
      trim: true,
    },
    description: { type: String, required: true, trim: true },
    requirements: [{ type: String, trim: true }],
    selectionRounds: [{ type: String, trim: true }],
    tags: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: Object.values(PUBLISHING_STATUS),
      default: PUBLISHING_STATUS.PUBLISHED,
      index: true,
    },
    publishedAt: { type: Date, default: Date.now, index: true },
    viewCount: { type: Number, default: 0 },
    clickCount: { type: Number, default: 0 },
    applicantsCount: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    publishedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

jobSchema.index({ title: 'text', companyName: 'text', description: 'text' });

export const JobModel = model<IJob>('Job', jobSchema);
