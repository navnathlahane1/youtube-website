import { Schema, model, Document, Types } from 'mongoose';

export interface ISubjectUnit {
  unitNumber: number;
  title: string;
  description?: string;
  keyTopics: string[];
  weightagePercentage?: number;
}

export interface ISubject extends Document {
  name: string;
  code: string; // e.g. "CS501", "MA301"
  slug: string;
  branchId: Types.ObjectId;
  semesterId: Types.ObjectId;
  credits: number;
  description?: string;
  syllabusOverview?: string;
  units: ISubjectUnit[];
  recommendedBooks: { title: string; author: string; edition?: string }[];
  isElective: boolean;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const subjectUnitSchema = new Schema<ISubjectUnit>(
  {
    unitNumber: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    keyTopics: [{ type: String, trim: true }],
    weightagePercentage: { type: Number },
  },
  { _id: false }
);

const subjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true, trim: true, index: true },
    slug: { type: String, required: true, lowercase: true, trim: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    semesterId: { type: Schema.Types.ObjectId, ref: 'Semester', required: true, index: true },
    credits: { type: Number, default: 4 },
    description: { type: String, trim: true },
    syllabusOverview: { type: String, trim: true },
    units: [subjectUnitSchema],
    recommendedBooks: [
      {
        title: { type: String, required: true },
        author: { type: String, required: true },
        edition: { type: String },
      },
    ],
    isElective: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
);

// Compound index for uniqueness across branch and code
subjectSchema.index({ branchId: 1, code: 1 }, { unique: true });
subjectSchema.index({ branchId: 1, semesterId: 1 });

export const SubjectModel = model<ISubject>('Subject', subjectSchema);
