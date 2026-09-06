import { Schema, model, Document, Types } from 'mongoose';
import { LEAD_STATUS, LeadStatus } from '../../common/constants';

export interface ILeadNote {
  note: string;
  authorEmail: string;
  createdAt: Date;
}

export interface ILead extends Document {
  fullName: string;
  email: string;
  phone: string;
  collegeName?: string;
  branchName?: string;
  currentSemester?: number;
  interestedCourseId?: Types.ObjectId;
  interestedCourseTitle?: string;
  inquiryType: 'DEMO_CLASS' | 'COURSE_ENROLLMENT' | 'OFFLINE_CENTER_VISIT' | 'CAREER_COUNSELING' | 'GENERAL';
  message?: string;
  status: LeadStatus;
  notes: ILeadNote[];
  assignedCounselorId?: Types.ObjectId;
  nextFollowUpDate?: Date;
  source: string; // e.g., "HOMEPAGE_HERO", "COURSE_PAGE", "FOOTER_CTA", "MODAL"
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const leadNoteSchema = new Schema<ILeadNote>(
  {
    note: { type: String, required: true },
    authorEmail: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const leadSchema = new Schema<ILead>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, required: true, trim: true, index: true },
    collegeName: { type: String, trim: true },
    branchName: { type: String, trim: true },
    currentSemester: { type: Number },
    interestedCourseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    interestedCourseTitle: { type: String, trim: true },
    inquiryType: {
      type: String,
      enum: ['DEMO_CLASS', 'COURSE_ENROLLMENT', 'OFFLINE_CENTER_VISIT', 'CAREER_COUNSELING', 'GENERAL'],
      default: 'DEMO_CLASS',
      index: true,
    },
    message: { type: String, trim: true },
    status: {
      type: String,
      enum: Object.values(LEAD_STATUS),
      default: LEAD_STATUS.NEW,
      index: true,
    },
    notes: [leadNoteSchema],
    assignedCounselorId: { type: Schema.Types.ObjectId, ref: 'Admin' },
    nextFollowUpDate: { type: Date },
    source: { type: String, default: 'WEBSITE' },
    ipAddress: { type: String },
  },
  {
    timestamps: true,
  }
);

leadSchema.index({ createdAt: -1, status: 1 });

export const LeadModel = model<ILead>('Lead', leadSchema);
