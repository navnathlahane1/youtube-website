import { PYQModel } from '../pyqs/pyqs.model';
import { NoteModel } from '../notes/notes.model';
import { VideoModel } from '../videos/videos.model';
import { PlaylistModel } from '../playlists/playlists.model';
import { ProjectModel } from '../projects/projects.model';
import { JobModel } from '../jobs/jobs.model';
import { CareerResourceModel } from '../career/career.model';
import { SubjectModel } from '../subjects/subjects.model';
import { CourseModel } from '../courses/courses.model';
import { PUBLISHING_STATUS } from '../../common/constants';

export interface SearchQueryFilters {
  q?: string;
  type?: string; // 'all', 'pyq', 'note', 'video', 'playlist', 'project', 'job', 'career', 'subject', 'course'
  branchId?: string;
  semesterId?: string;
  subjectId?: string;
  difficulty?: string;
  limit?: number;
}

export class SearchService {
  static async search(filters: SearchQueryFilters) {
    const q = filters.q ? filters.q.trim() : '';
    const regex = q ? new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') : null;
    const limit = Math.min(filters.limit || 20, 50);
    const type = filters.type || 'all';

    const results: any[] = [];

    // Helper for regex matching condition
    const makeTextQuery = (fields: string[]) => {
      if (!regex) return {};
      return {
        $or: fields.map((f) => ({ [f]: { $regex: regex } })),
      };
    };

    // 1. Subjects
    if (type === 'all' || type === 'subject') {
      const subjectFilter: any = { isActive: true };
      if (regex) Object.assign(subjectFilter, makeTextQuery(['name', 'code', 'description']));
      if (filters.branchId) subjectFilter.branchId = filters.branchId;
      if (filters.semesterId) subjectFilter.semesterId = filters.semesterId;

      const subjects = await SubjectModel.find(subjectFilter)
        .populate('branchId', 'name code slug')
        .populate('semesterId', 'number name')
        .limit(limit)
        .lean();

      subjects.forEach((s) => {
        results.push({
          id: s._id,
          type: 'subject',
          title: `${s.name} (${s.code})`,
          subtitle: `${(s.branchId as any)?.name || ''} - ${(s.semesterId as any)?.name || ''}`,
          slug: s.slug,
          url: `/academics/${(s.branchId as any)?.slug || 'branch'}/${(s.semesterId as any)?.number || 1}/${s.slug}`,
          metadata: {
            credits: s.credits,
            unitsCount: s.units?.length || 0,
          },
        });
      });
    }

    // 2. PYQs
    if (type === 'all' || type === 'pyq') {
      const pyqFilter: any = { status: PUBLISHING_STATUS.PUBLISHED };
      if (regex) Object.assign(pyqFilter, makeTextQuery(['title', 'examType', 'description', 'tags']));
      if (filters.branchId) pyqFilter.branchId = filters.branchId;
      if (filters.semesterId) pyqFilter.semesterId = filters.semesterId;
      if (filters.subjectId) pyqFilter.subjectId = filters.subjectId;
      if (filters.difficulty) pyqFilter.difficulty = filters.difficulty;

      const pyqs = await PYQModel.find(pyqFilter)
        .populate('subjectId', 'name code')
        .populate('branchId', 'name code')
        .limit(limit)
        .lean();

      pyqs.forEach((p) => {
        results.push({
          id: p._id,
          type: 'pyq',
          title: p.title,
          subtitle: `${(p.subjectId as any)?.name || ''} • Year ${p.year}`,
          slug: p.slug,
          url: `/pyqs/${p.slug}`,
          badge: `${p.year} Exam`,
          metadata: {
            year: p.year,
            examType: p.examType,
            hasSolution: p.hasSolution,
            difficulty: p.difficulty,
          },
        });
      });
    }

    // 3. Notes
    if (type === 'all' || type === 'note') {
      const noteFilter: any = { status: PUBLISHING_STATUS.PUBLISHED };
      if (regex) Object.assign(noteFilter, makeTextQuery(['title', 'unitTitle', 'authorName', 'description', 'tags']));
      if (filters.branchId) noteFilter.branchId = filters.branchId;
      if (filters.semesterId) noteFilter.semesterId = filters.semesterId;
      if (filters.subjectId) noteFilter.subjectId = filters.subjectId;

      const notes = await NoteModel.find(noteFilter)
        .populate('subjectId', 'name code')
        .populate('branchId', 'name code')
        .limit(limit)
        .lean();

      notes.forEach((n) => {
        results.push({
          id: n._id,
          type: 'note',
          title: n.title,
          subtitle: `${(n.subjectId as any)?.name || ''} • ${n.authorName || 'Faculty Note'}`,
          slug: n.slug,
          url: `/notes/${n.slug}`,
          badge: n.isHandwritten ? 'Handwritten' : 'PDF Note',
          metadata: {
            unitNumber: n.unitNumber,
            pageCount: n.pageCount,
          },
        });
      });
    }

    // 4. Videos
    if (type === 'all' || type === 'video') {
      const videoFilter: any = { status: PUBLISHING_STATUS.PUBLISHED };
      if (regex) Object.assign(videoFilter, makeTextQuery(['title', 'description', 'instructorName', 'tags']));
      if (filters.branchId) videoFilter.branchId = filters.branchId;
      if (filters.semesterId) videoFilter.semesterId = filters.semesterId;
      if (filters.subjectId) videoFilter.subjectId = filters.subjectId;

      const videos = await VideoModel.find(videoFilter)
        .populate('subjectId', 'name code')
        .limit(limit)
        .lean();

      videos.forEach((v) => {
        results.push({
          id: v._id,
          type: 'video',
          title: v.title,
          subtitle: `${(v.subjectId as any)?.name || ''} • ${v.instructorName || 'Lecture'}`,
          slug: v.slug,
          url: `/videos/${v.slug}`,
          badge: 'Video Lecture',
          metadata: {
            durationSeconds: v.durationSeconds,
            youtubeId: v.youtubeId,
          },
        });
      });
    }

    // 5. Projects
    if (type === 'all' || type === 'project') {
      const projectFilter: any = { status: PUBLISHING_STATUS.PUBLISHED };
      if (regex) Object.assign(projectFilter, makeTextQuery(['title', 'abstract', 'description', 'techStack', 'category']));
      if (filters.difficulty) projectFilter.difficulty = filters.difficulty;

      const projects = await ProjectModel.find(projectFilter).limit(limit).lean();

      projects.forEach((pr) => {
        results.push({
          id: pr._id,
          type: 'project',
          title: pr.title,
          subtitle: `${pr.category} • Stack: ${pr.techStack?.slice(0, 3).join(', ')}`,
          slug: pr.slug,
          url: `/projects/${pr.slug}`,
          badge: pr.category,
          metadata: {
            techStack: pr.techStack,
            difficulty: pr.difficulty,
          },
        });
      });
    }

    // 6. Courses
    if (type === 'all' || type === 'course') {
      const courseFilter: any = { status: PUBLISHING_STATUS.PUBLISHED };
      if (regex) Object.assign(courseFilter, makeTextQuery(['title', 'tagline', 'description', 'category']));

      const courses = await CourseModel.find(courseFilter).limit(limit).lean();

      courses.forEach((c) => {
        results.push({
          id: c._id,
          type: 'course',
          title: c.title,
          subtitle: `${c.category} • ${c.mode.replace('_', ' ')}`,
          slug: c.slug,
          url: `/courses/${c.slug}`,
          badge: 'Offline Course',
          metadata: {
            mode: c.mode,
            durationMonths: c.durationMonths,
            price: c.price,
          },
        });
      });
    }

    // 7. Jobs & Placements
    if (type === 'all' || type === 'job') {
      const jobFilter: any = { status: PUBLISHING_STATUS.PUBLISHED };
      if (regex) Object.assign(jobFilter, makeTextQuery(['title', 'companyName', 'description', 'location']));

      const jobs = await JobModel.find(jobFilter).limit(limit).lean();

      jobs.forEach((j) => {
        results.push({
          id: j._id,
          type: 'job',
          title: `${j.title} at ${j.companyName}`,
          subtitle: `${j.location} • ${j.salaryOrStipend}`,
          slug: j.slug,
          url: `/careers/jobs/${j.slug}`,
          badge: j.jobType,
          metadata: {
            company: j.companyName,
            salary: j.salaryOrStipend,
            deadline: j.applicationDeadline,
          },
        });
      });
    }

    // 8. Career Roadmaps
    if (type === 'all' || type === 'career') {
      const careerFilter: any = { status: PUBLISHING_STATUS.PUBLISHED };
      if (regex) Object.assign(careerFilter, makeTextQuery(['title', 'domain', 'summary', 'targetYearOrRole']));

      const careers = await CareerResourceModel.find(careerFilter).limit(limit).lean();

      careers.forEach((cr) => {
        results.push({
          id: cr._id,
          type: 'career',
          title: cr.title,
          subtitle: `${cr.domain} • ${cr.targetYearOrRole}`,
          slug: cr.slug,
          url: `/careers/roadmaps/${cr.slug}`,
          badge: cr.type,
          metadata: {
            domain: cr.domain,
            stagesCount: cr.stages?.length || 0,
          },
        });
      });
    }

    return {
      query: q,
      totalCount: results.length,
      items: results.slice(0, limit),
    };
  }
}
