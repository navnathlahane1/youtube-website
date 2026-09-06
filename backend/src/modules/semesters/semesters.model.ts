import { Schema, model, Document, Types } from 'mongoose';

export interface ISemester extends Document {
  number: number; // 1 to 8
  name: string; // e.g., "Semester 1", "Semester 5"
  slug: string; // e.g., "sem-1", "sem-5"
  academicYearId: Types.ObjectId;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const semesterSchema = new Schema<ISemester>(
  {
    number: { type: Number, required: true, min: 1, max: 10, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    academicYearId: { type: Schema.Types.ObjectId, ref: 'AcademicYear', required: true, index: true },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

export const SemesterModel = model<ISemester>('Semester', semesterSchema);
