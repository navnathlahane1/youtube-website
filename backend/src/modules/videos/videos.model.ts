import { Schema, model, Document, Types } from 'mongoose';
import { PUBLISHING_STATUS, PublishingStatus } from '../../common/constants';

export interface IVideoTimestamp {
  seconds: number;
  label: string;
}

export interface IVideo extends Document {
  title: string;
  slug: string;
  youtubeId: string;
  videoUrl: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  subjectId: Types.ObjectId;
  branchId: Types.ObjectId;
  semesterId: Types.ObjectId;
  unitNumber?: number;
  instructorName?: string;
  timestamps: IVideoTimestamp[];
  status: PublishingStatus;
  publishedAt?: Date;
  viewCount: number;
  tags: string[];
  description?: string;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  publishedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const videoTimestampSchema = new Schema<IVideoTimestamp>(
  {
    seconds: { type: Number, required: true },
    label: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const videoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    youtubeId: { type: String, required: true, trim: true },
    videoUrl: { type: String, required: true, trim: true },
    thumbnailUrl: { type: String },
    durationSeconds: { type: Number, default: 0 },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    semesterId: { type: Schema.Types.ObjectId, ref: 'Semester', required: true, index: true },
    unitNumber: { type: Number },
    instructorName: { type: String, trim: true },
    timestamps: [videoTimestampSchema],
    status: {
      type: String,
      enum: Object.values(PUBLISHING_STATUS),
      default: PUBLISHING_STATUS.DRAFT,
      index: true,
    },
    publishedAt: { type: Date, index: true },
    viewCount: { type: Number, default: 0 },
    tags: [{ type: String, trim: true }],
    description: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    publishedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  },
  {
    timestamps: true,
  }
);

videoSchema.index({ branchId: 1, semesterId: 1, subjectId: 1, status: 1 });

export const VideoModel = model<IVideo>('Video', videoSchema);
