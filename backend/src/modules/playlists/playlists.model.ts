import { Schema, model, Document, Types } from 'mongoose';
import { PUBLISHING_STATUS, PublishingStatus } from '../../common/constants';

export interface IPlaylist extends Document {
  title: string;
  slug: string;
  subjectId: Types.ObjectId;
  branchId: Types.ObjectId;
  semesterId: Types.ObjectId;
  description?: string;
  thumbnailUrl?: string;
  videoIds: Types.ObjectId[];
  totalVideos: number;
  status: PublishingStatus;
  publishedAt?: Date;
  viewCount: number;
  tags: string[];
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  publishedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const playlistSchema = new Schema<IPlaylist>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    semesterId: { type: Schema.Types.ObjectId, ref: 'Semester', required: true, index: true },
    description: { type: String, trim: true },
    thumbnailUrl: { type: String },
    videoIds: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
    totalVideos: { type: Number, default: 0 },
    status: {
      type: String,
      enum: Object.values(PUBLISHING_STATUS),
      default: PUBLISHING_STATUS.DRAFT,
      index: true,
    },
    publishedAt: { type: Date, index: true },
    viewCount: { type: Number, default: 0 },
    tags: [{ type: String, trim: true }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    publishedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  },
  {
    timestamps: true,
  }
);

export const PlaylistModel = model<IPlaylist>('Playlist', playlistSchema);
