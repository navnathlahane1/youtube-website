import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { env } from './config/env';
import { errorHandler } from './common/middleware/error-handler';

// Domain Module Routes
import { authRoutes } from './modules/auth/auth.routes';
import { adminsRoutes } from './modules/admins/admins.routes';
import { academicYearsRoutes } from './modules/academic-years/academic-years.routes';
import { branchesRoutes } from './modules/branches/branches.routes';
import { semestersRoutes } from './modules/semesters/semesters.routes';
import { subjectsRoutes } from './modules/subjects/subjects.routes';
import { pyqsRoutes } from './modules/pyqs/pyqs.routes';
import { notesRoutes } from './modules/notes/notes.routes';
import { videosRoutes } from './modules/videos/videos.routes';
import { playlistsRoutes } from './modules/playlists/playlists.routes';
import { projectsRoutes } from './modules/projects/projects.routes';
import { jobsRoutes } from './modules/jobs/jobs.routes';
import { careerRoutes } from './modules/career/career.routes';
import { coursesRoutes } from './modules/courses/courses.routes';
import { facultyRoutes } from './modules/faculty/faculty.routes';
import { eventsRoutes } from './modules/events/events.routes';
import { announcementsRoutes } from './modules/announcements/announcements.routes';
import { leadsRoutes } from './modules/leads/leads.routes';
import { mediaRoutes } from './modules/media/media.routes';
import { searchRoutes } from './modules/search/search.routes';
import { analyticsRoutes } from './modules/analytics/analytics.routes';
import { settingsRoutes } from './modules/settings/settings.routes';
import { auditLogsRoutes } from './modules/audit-logs/audit-logs.routes';

const app = express();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Cross-Origin Resource Sharing
const allowedOrigins = [
  env.CLIENT_URL,
  env.ADMIN_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow dev origins dynamically
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body and Cookie Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 300,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', globalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: { success: false, message: 'Too many authentication attempts, please try again after 15 minutes.' },
});
app.use('/api/v1/auth/login', authLimiter);

// Health Check
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

// API v1 Routing Table
const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/admins', adminsRoutes);
apiRouter.use('/academic-years', academicYearsRoutes);
apiRouter.use('/branches', branchesRoutes);
apiRouter.use('/semesters', semestersRoutes);
apiRouter.use('/subjects', subjectsRoutes);
apiRouter.use('/pyqs', pyqsRoutes);
apiRouter.use('/notes', notesRoutes);
apiRouter.use('/videos', videosRoutes);
apiRouter.use('/playlists', playlistsRoutes);
apiRouter.use('/projects', projectsRoutes);
apiRouter.use('/jobs', jobsRoutes);
apiRouter.use('/career', careerRoutes);
apiRouter.use('/courses', coursesRoutes);
apiRouter.use('/faculty', facultyRoutes);
apiRouter.use('/events', eventsRoutes);
apiRouter.use('/announcements', announcementsRoutes);
apiRouter.use('/leads', leadsRoutes);
apiRouter.use('/media', mediaRoutes);
apiRouter.use('/search', searchRoutes);
apiRouter.use('/analytics', analyticsRoutes);
apiRouter.use('/settings', settingsRoutes);
apiRouter.use('/audit-logs', auditLogsRoutes);

app.use('/api/v1', apiRouter);

// 404 Fallback
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export { app };
