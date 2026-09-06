import { Schema, model, Document } from 'mongoose';

export interface IBranch extends Document {
  name: string; // e.g. "Computer Science & Engineering"
  code: string; // e.g. "CSE", "IT", "AIDS", "ETC", "MECH", "CIVIL", "EE"
  slug: string;
  icon?: string;
  description?: string;
  totalSemesters: number;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const branchSchema = new Schema<IBranch>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    icon: { type: String },
    description: { type: String, trim: true },
    totalSemesters: { type: Number, default: 8 },
    order: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

export const BranchModel = model<IBranch>('Branch', branchSchema);
