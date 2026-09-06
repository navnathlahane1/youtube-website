import { Schema, model, Document } from 'mongoose';

export type AnalyticsEventType =
  | 'page_view'
  | 'resource_view'
  | 'resource_download'
  | 'search'
  | 'filter_used'
  | 'video_clicked'
  | 'job_clicked'
  | 'project_view'
  | 'lead_submitted'
  | 'course_interest'
  | 'contact_submitted';

export interface IAnalyticsEvent extends Document {
  event: AnalyticsEventType;
  resourceType?: string; // e.g. 'pyq', 'note', 'video', 'project', 'job', 'course'
  resourceId?: string;
  resourceTitle?: string;
  branchCode?: string;
  semesterNumber?: number;
  subjectCode?: string;
  searchQuery?: string;
  path?: string;
  source?: string;
  ipHash?: string;
  userAgent?: string;
  timestamp: Date;
}

const analyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    event: { type: String, required: true, index: true },
    resourceType: { type: String, index: true },
    resourceId: { type: String, index: true },
    resourceTitle: { type: String },
    branchCode: { type: String, index: true },
    semesterNumber: { type: Number },
    subjectCode: { type: String },
    searchQuery: { type: String },
    path: { type: String },
    source: { type: String },
    ipHash: { type: String },
    userAgent: { type: String },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: false,
  }
);

analyticsEventSchema.index({ event: 1, timestamp: -1 });

export const AnalyticsEventModel = model<IAnalyticsEvent>('AnalyticsEvent', analyticsEventSchema);
