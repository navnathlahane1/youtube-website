import { Schema, model, Document } from 'mongoose';

export interface IAcademicYear extends Document {
  name: string; // e.g., "First Year (FE)", "Second Year (SE)", "Third Year (TE)", "Final Year (BE)"
  code: string; // e.g., "FE", "SE", "TE", "BE"
  order: number;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const academicYearSchema = new Schema<IAcademicYear>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    order: { type: Number, required: true, default: 1 },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

export const AcademicYearModel = model<IAcademicYear>('AcademicYear', academicYearSchema);
