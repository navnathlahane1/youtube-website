import { Schema, model, Document, Types } from 'mongoose';
import { PUBLISHING_STATUS, PublishingStatus, COURSE_MODES, CourseMode } from '../../common/constants';

export interface IBatchSchedule {
  batchName: string; // e.g., "Weekend Batch A", "Regular Evening Batch"
  startDate: Date;
  timing: string; // e.g., "6:00 PM - 8:30 PM (Mon-Fri)"
  totalSeats: number;
  availableSeats: number;
  classroomLocation: string; // e.g., "Offline Learning Center - Lab 3, Tech Park"
  isEnrolling: boolean;
}

export interface ICourse extends Document {
  title: string;
  slug: string;
  category: string; // e.g., "Semester Mastery", "GATE Comprehensive", "Full Stack Placement Track", "Core Engineering CAD"
  tagline: string;
  description: string;
  curriculum: {
    moduleNumber: number;
    title: string;
    topics: string[];
    durationHours: number;
  }[];
  mode: CourseMode;
  durationMonths: number;
  featuredImageUrl?: string;
  brochurePdfUrl?: string;
  price: {
    original: number;
    discounted?: number;
    scholarshipAvailable: boolean;
    scholarshipUptoPercentage?: number;
  };
  features: string[]; // e.g., ["Hands-on Lab Practice", "1-on-1 Doubt Sessions with Faculty", "Placement Assistance", "Printed Formula Booklets"]
  targetBranches: Types.ObjectId[];
  targetSemesters: number[];
  batches: IBatchSchedule[];
  facultyIds: Types.ObjectId[];
  status: PublishingStatus;
  publishedAt?: Date;
  isFeatured: boolean;
  order: number;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  publishedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const batchScheduleSchema = new Schema<IBatchSchedule>(
  {
    batchName: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    timing: { type: String, required: true, trim: true },
    totalSeats: { type: Number, required: true, default: 30 },
    availableSeats: { type: Number, required: true, default: 30 },
    classroomLocation: { type: String, required: true, trim: true },
    isEnrolling: { type: Boolean, default: true },
  },
  { _id: false }
);

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    category: { type: String, required: true, trim: true, index: true },
    tagline: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    curriculum: [
      {
        moduleNumber: { type: Number, required: true },
        title: { type: String, required: true, trim: true },
        topics: [{ type: String, trim: true }],
        durationHours: { type: Number, default: 10 },
      },
    ],
    mode: {
      type: String,
      enum: Object.values(COURSE_MODES),
      default: COURSE_MODES.OFFLINE_CLASSROOM,
      index: true,
    },
    durationMonths: { type: Number, required: true, default: 4 },
    featuredImageUrl: { type: String },
    brochurePdfUrl: { type: String },
    price: {
      original: { type: Number, required: true },
      discounted: { type: Number },
      scholarshipAvailable: { type: Boolean, default: true },
      scholarshipUptoPercentage: { type: Number, default: 50 },
    },
    features: [{ type: String, trim: true }],
    targetBranches: [{ type: Schema.Types.ObjectId, ref: 'Branch' }],
    targetSemesters: [{ type: Number }],
    batches: [batchScheduleSchema],
    facultyIds: [{ type: Schema.Types.ObjectId, ref: 'Faculty' }],
    status: {
      type: String,
      enum: Object.values(PUBLISHING_STATUS),
      default: PUBLISHING_STATUS.DRAFT,
      index: true,
    },
    publishedAt: { type: Date, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 1 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    publishedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  },
  {
    timestamps: true,
  }
);

courseSchema.index({ title: 'text', tagline: 'text', description: 'text' });

export const CourseModel = model<ICourse>('Course', courseSchema);
