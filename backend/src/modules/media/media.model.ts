import { Schema, model, Document, Types } from 'mongoose';

export interface IMedia extends Document {
  publicId: string;
  url: string;
  secureUrl: string;
  originalFilename: string;
  format: string; // e.g. "pdf", "jpg", "png", "webp"
  resourceType: 'image' | 'raw' | 'video' | 'auto';
  fileSizeBytes: number;
  width?: number;
  height?: number;
  uploadedBy?: Types.ObjectId;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema<IMedia>(
  {
    publicId: { type: String, required: true, unique: true, index: true },
    url: { type: String, required: true },
    secureUrl: { type: String, required: true },
    originalFilename: { type: String, required: true },
    format: { type: String, required: true },
    resourceType: { type: String, required: true, default: 'auto' },
    fileSizeBytes: { type: Number, required: true },
    width: { type: Number },
    height: { type: Number },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    tags: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
  }
);

export const MediaModel = model<IMedia>('Media', mediaSchema);
