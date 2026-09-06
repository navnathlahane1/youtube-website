export const PUBLISHING_STATUS = {
  DRAFT: 'DRAFT',
  IN_REVIEW: 'IN_REVIEW',
  APPROVED: 'APPROVED',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type PublishingStatus = (typeof PUBLISHING_STATUS)[keyof typeof PUBLISHING_STATUS];

export const ADMIN_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
} as const;

export type AdminRole = (typeof ADMIN_ROLES)[keyof typeof ADMIN_ROLES];

export const RESOURCE_TYPES = {
  PYQ: 'pyq',
  NOTE: 'note',
  VIDEO: 'video',
  PLAYLIST: 'playlist',
  PROJECT: 'project',
  SYLLABUS: 'syllabus',
} as const;

export type ResourceType = (typeof RESOURCE_TYPES)[keyof typeof RESOURCE_TYPES];

export const LEAD_STATUS = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  INTERESTED: 'INTERESTED',
  CONVERTED: 'CONVERTED',
  LOST: 'LOST',
} as const;

export type LeadStatus = (typeof LEAD_STATUS)[keyof typeof LEAD_STATUS];

export const DIFFICULTY_LEVELS = {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
} as const;

export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[keyof typeof DIFFICULTY_LEVELS];

export const EVENT_TYPES = {
  WORKSHOP: 'WORKSHOP',
  HACKATHON: 'HACKATHON',
  SEMINAR: 'SEMINAR',
  DEMO_CLASS: 'DEMO_CLASS',
  WEBINAR: 'WEBINAR',
  CAMPUS_DRIVE: 'CAMPUS_DRIVE',
} as const;

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

export const COURSE_MODES = {
  OFFLINE_CLASSROOM: 'OFFLINE_CLASSROOM',
  HYBRID: 'HYBRID',
  WEEKEND_INTENSIVE: 'WEEKEND_INTENSIVE',
} as const;

export type CourseMode = (typeof COURSE_MODES)[keyof typeof COURSE_MODES];
