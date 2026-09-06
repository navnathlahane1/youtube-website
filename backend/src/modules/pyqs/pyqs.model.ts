import { Schema, model, Document, Types } from 'mongoose';
import { PUBLISHING_STATUS, PublishingStatus, DIFFICULTY_LEVELS, DifficultyLevel } from '../../common/constants';

export interface IPYQ extends Document {
  title: string;
  slug: string;
  subjectId: Types.ObjectId;
  branchId: Types.ObjectId;
  semesterId: Types.ObjectId;
  academicYearId?: Types.ObjectId;
  year: number; // e.g., 2024, 2023, 2022
  examType: string; // e.g., "End-Semester Examination", "Mid-Semester Examination", "In-Sem", "Backlog"
  questionPaperUrl: string; // PDF link
  solutionPaperUrl?: string; // Solution PDF link
  hasSolution: boolean;
  difficulty: DifficultyLevel;
  totalMarks?: number;
  durationMinutes?: number;
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

const pyqSchema = new Schema<IPYQ>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    semesterId: { type: Schema.Types.ObjectId, ref: 'Semester', required: true, index: true },
    academicYearId: { type: Schema.Types.ObjectId, ref: 'AcademicYear' },
    year: { type: Number, required: true, index: true },
    examType: { type: String, required: true, trim: true },
    questionPaperUrl: { type: String, required: true },
    solutionPaperUrl: { type: String },
    hasSolution: { type: Boolean, default: false },
    difficulty: {
      type: String,
      enum: Object.values(DIFFICULTY_LEVELS),
      default: DIFFICULTY_LEVELS.INTERMEDIATE,
    },
    totalMarks: { type: Number, default: 100 },
    durationMinutes: { type: Number, default: 180 },
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

// Compound indexes for fast query resolution on search & filtering
pyqSchema.index({ branchId: 1, semesterId: 1, subjectId: 1, year: -1, status: 1 });
pyqSchema.index({ title: 'text', description: 'text', tags: 'text' });

export const PYQModel = model<IPYQ>('PYQ', pyqSchema);
