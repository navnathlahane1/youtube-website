import { Schema, model, Document, Types } from 'mongoose';
import { EVENT_TYPES, EventType, PUBLISHING_STATUS, PublishingStatus } from '../../common/constants';

export interface IEvent extends Document {
  title: string;
  slug: string;
  eventType: EventType;
  bannerImageUrl?: string;
  summary: string;
  description: string;
  startDate: Date;
  endDate: Date;
  mode: 'OFFLINE_CENTER' | 'ONLINE_WEBINAR' | 'HYBRID';
  venueOrLink: string;
  speakerName?: string;
  speakerBio?: string;
  registrationOpen: boolean;
  registrationLimit?: number;
  registeredCount: number;
  status: PublishingStatus;
  publishedAt?: Date;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    eventType: {
      type: String,
      enum: Object.values(EVENT_TYPES),
      default: EVENT_TYPES.WORKSHOP,
      index: true,
    },
    bannerImageUrl: { type: String },
    summary: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true },
    mode: {
      type: String,
      enum: ['OFFLINE_CENTER', 'ONLINE_WEBINAR', 'HYBRID'],
      default: 'OFFLINE_CENTER',
    },
    venueOrLink: { type: String, required: true, trim: true },
    speakerName: { type: String, trim: true },
    speakerBio: { type: String, trim: true },
    registrationOpen: { type: Boolean, default: true, index: true },
    registrationLimit: { type: Number, default: 100 },
    registeredCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: Object.values(PUBLISHING_STATUS),
      default: PUBLISHING_STATUS.DRAFT,
      index: true,
    },
    publishedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  },
  {
    timestamps: true,
  }
);

export const EventModel = model<IEvent>('Event', eventSchema);
