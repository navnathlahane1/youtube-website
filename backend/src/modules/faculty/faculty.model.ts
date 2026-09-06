import { Schema, model, Document, Types } from 'mongoose';

export interface IFaculty extends Document {
  name: string;
  slug: string;
  designation: string; // e.g. "Senior Professor - Engineering Mathematics & AI", "Ex-IITian GATE Specialist"
  qualification: string; // e.g. "M.Tech (IIT Bombay), Ph.D."
  experienceYears: number;
  bio: string;
  photoUrl?: string;
  specializationBranches: Types.ObjectId[];
  subjectsTaught: string[];
  achievements: string[];
  studentRating: number; // e.g., 4.9
  studentReviewsCount: number;
  linkedinUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const facultySchema = new Schema<IFaculty>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    designation: { type: String, required: true, trim: true },
    qualification: { type: String, required: true, trim: true },
    experienceYears: { type: Number, required: true, default: 5 },
    bio: { type: String, required: true, trim: true },
    photoUrl: { type: String },
    specializationBranches: [{ type: Schema.Types.ObjectId, ref: 'Branch' }],
    subjectsTaught: [{ type: String, trim: true }],
    achievements: [{ type: String, trim: true }],
    studentRating: { type: Number, default: 4.9 },
    studentReviewsCount: { type: Number, default: 120 },
    linkedinUrl: { type: String },
    order: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

export const FacultyModel = model<IFaculty>('Faculty', facultySchema);
