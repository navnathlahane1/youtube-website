import { Schema, model, Document, Types } from 'mongoose';
import { PUBLISHING_STATUS, PublishingStatus, DIFFICULTY_LEVELS, DifficultyLevel } from '../../common/constants';

export interface IProject extends Document {
  title: string;
  slug: string;
  category: string; // e.g. "Final Year Project (Major)", "Mini Project", "IoT & Embedded", "AI & Data Science"
  abstract: string;
  description: string;
  branchIds: Types.ObjectId[];
  techStack: string[]; // e.g. ["React", "Python", "OpenCV", "Raspberry Pi"]
  githubUrl?: string;
  demoUrl?: string;
  reportPdfUrl?: string;
  thumbnailUrl?: string;
  difficulty: DifficultyLevel;
  hardwareRequired?: string[];
  features: string[];
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

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    category: { type: String, required: true, trim: true, index: true },
    abstract: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    branchIds: [{ type: Schema.Types.ObjectId, ref: 'Branch', index: true }],
    techStack: [{ type: String, trim: true, index: true }],
    githubUrl: { type: String },
    demoUrl: { type: String },
    reportPdfUrl: { type: String },
    thumbnailUrl: { type: String },
    difficulty: {
      type: String,
      enum: Object.values(DIFFICULTY_LEVELS),
      default: DIFFICULTY_LEVELS.INTERMEDIATE,
    },
    hardwareRequired: [{ type: String, trim: true }],
    features: [{ type: String, trim: true }],
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

projectSchema.index({ title: 'text', abstract: 'text', techStack: 'text' });

export const ProjectModel = model<IProject>('Project', projectSchema);
