import { Schema, model, Document, Types } from 'mongoose';
import { PUBLISHING_STATUS, PublishingStatus } from '../../common/constants';

export interface ICareerResource extends Document {
  title: string;
  slug: string;
  type: 'ROADMAP' | 'INTERVIEW_GUIDE' | 'RESUME_TEMPLATE' | 'GATE_PREP' | 'CORE_CAREER';
  domain: string; // e.g. "Full Stack Web Development", "DevOps & Cloud", "AI & Machine Learning", "Embedded & IoT", "Data Science", "Core Mechanical"
  targetYearOrRole: string; // e.g. "2nd to 4th Year Engineering", "Software Engineer Role"
  summary: string;
  contentMarkdown: string;
  recommendedCertifications: string[];
  toolsAndTechnologies: string[];
  stages: {
    stageNumber: number;
    title: string;
    description: string;
    keySkills: string[];
    recommendedFreeResources: { title: string; url: string }[];
  }[];
  downloadableAssetUrl?: string;
  status: PublishingStatus;
  publishedAt?: Date;
  viewCount: number;
  downloadCount: number;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  publishedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const careerResourceSchema = new Schema<ICareerResource>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    type: {
      type: String,
      enum: ['ROADMAP', 'INTERVIEW_GUIDE', 'RESUME_TEMPLATE', 'GATE_PREP', 'CORE_CAREER'],
      required: true,
      index: true,
    },
    domain: { type: String, required: true, trim: true, index: true },
    targetYearOrRole: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    contentMarkdown: { type: String, required: true },
    recommendedCertifications: [{ type: String, trim: true }],
    toolsAndTechnologies: [{ type: String, trim: true }],
    stages: [
      {
        stageNumber: { type: Number, required: true },
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        keySkills: [{ type: String, trim: true }],
        recommendedFreeResources: [
          {
            title: { type: String, required: true },
            url: { type: String, required: true },
          },
        ],
      },
    ],
    downloadableAssetUrl: { type: String },
    status: {
      type: String,
      enum: Object.values(PUBLISHING_STATUS),
      default: PUBLISHING_STATUS.DRAFT,
      index: true,
    },
    publishedAt: { type: Date, index: true },
    viewCount: { type: Number, default: 0 },
    downloadCount: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    publishedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  },
  {
    timestamps: true,
  }
);

careerResourceSchema.index({ title: 'text', domain: 'text', summary: 'text' });

export const CareerResourceModel = model<ICareerResource>('CareerResource', careerResourceSchema);
