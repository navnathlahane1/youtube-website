import { Schema, model, Document } from 'mongoose';

export interface ISetting extends Document {
  key: string; // e.g. "PLATFORM_CONFIG"
  siteName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  offlineCenter: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    contactPhone: string;
    helplinePhone: string;
    counselingEmail: string;
    googleMapsEmbedUrl: string;
    visitingHours: string;
    features: string[];
  };
  socialLinks: {
    youtube?: string;
    telegram?: string;
    instagram?: string;
    linkedin?: string;
    whatsapp?: string;
  };
  topBanner: {
    isActive: boolean;
    text: string;
    actionLabel: string;
    actionUrl: string;
  };
  seoDefaults: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImageUrl: string;
  };
  updatedAt: Date;
}

const settingSchema = new Schema<ISetting>(
  {
    key: { type: String, required: true, unique: true, default: 'PLATFORM_CONFIG' },
    siteName: { type: String, default: 'Apex Engineering Academy & Resource Portal' },
    tagline: { type: String, default: 'Premier Offline Learning Center & Digital Resource Hub for Engineers' },
    heroHeadline: { type: String, default: 'Master Your Engineering Degree. Crack High-Paying Placements.' },
    heroSubheadline: {
      type: String,
      default:
        'Join our offline classroom coaching with expert faculty, and access curated PYQs, notes, crash courses, and career roadmaps.',
    },
    offlineCenter: {
      name: { type: String, default: 'Apex Engineering Learning Center' },
      address: { type: String, default: 'Plot 42, Education Hub, Tech Park Boulevard' },
      city: { type: String, default: 'Pune' },
      state: { type: String, default: 'Maharashtra' },
      pincode: { type: String, default: '411001' },
      contactPhone: { type: String, default: '+91 98765 43210' },
      helplinePhone: { type: String, default: '+91 98765 43211' },
      counselingEmail: { type: String, default: 'admissions@apexengineering.edu' },
      googleMapsEmbedUrl: { type: String, default: 'https://maps.google.com' },
      visitingHours: { type: String, default: 'Mon - Sat: 8:00 AM - 8:00 PM | Sun: 9:00 AM - 2:00 PM' },
      features: {
        type: [String],
        default: [
          'Air-conditioned smart classrooms',
          'High-performance computing & IoT labs',
          '1-on-1 personalized doubt clearance cabins',
          'Rich engineering reference library & silent reading rooms',
          'Dedicated placement & mock interview cell',
        ],
      },
    },
    socialLinks: {
      youtube: { type: String, default: 'https://youtube.com/@apexengineering' },
      telegram: { type: String, default: 'https://t.me/apexengineering' },
      instagram: { type: String, default: 'https://instagram.com/apexengineering' },
      linkedin: { type: String, default: 'https://linkedin.com/company/apexengineering' },
      whatsapp: { type: String, default: 'https://wa.me/919876543210' },
    },
    topBanner: {
      isActive: { type: Boolean, default: true },
      text: { type: String, default: '🎯 Admissions Open for Offline Semester & GATE 2026 Batches! Avail up to 50% Scholarship.' },
      actionLabel: { type: String, default: 'Book Free Demo' },
      actionUrl: { type: String, default: '/courses' },
    },
    seoDefaults: {
      metaTitle: { type: String, default: 'Apex Engineering Academy | Notes, PYQs & Offline Coaching' },
      metaDescription: {
        type: String,
        default:
          'Comprehensive engineering portal providing free PYQs, handwritten notes, video lectures, syllabus breakdowns, and top-tier offline classroom coaching.',
      },
      keywords: {
        type: [String],
        default: ['engineering notes', 'pyq papers', 'engineering syllabus', 'offline coaching', 'gate preparation', 'semester tuitions'],
      },
      ogImageUrl: { type: String, default: '/images/og-cover.png' },
    },
  },
  {
    timestamps: true,
  }
);

export const SettingModel = model<ISetting>('Setting', settingSchema);
