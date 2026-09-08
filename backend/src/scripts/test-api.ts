import http from 'http';
import { app } from '../app';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { logger } from '../config/logger';
import { AdminModel } from '../modules/admins/admins.model';
import { BranchModel } from '../modules/branches/branches.model';
import { SubjectModel } from '../modules/subjects/subjects.model';
import { SemesterModel } from '../modules/semesters/semesters.model';
import { AcademicYearModel } from '../modules/academic-years/academic-years.model';
import { PYQModel } from '../modules/pyqs/pyqs.model';
import { hashPassword } from '../common/utils/password';
import { ADMIN_ROLES, PUBLISHING_STATUS, DIFFICULTY_LEVELS } from '../common/constants';

async function runTests() {
  try {
    logger.info('🧪 Starting Backend API Automated Verification Suite...');
    await connectDatabase();

    // Find or create test entities
    let admin = await AdminModel.findOne({ email: 'admin@engineering.edu' });
    if (!admin) {
      const passwordHash = await hashPassword('Admin@12345');
      admin = await AdminModel.create({
        name: 'Test Super Admin',
        email: 'admin@engineering.edu',
        passwordHash,
        role: ADMIN_ROLES.SUPER_ADMIN,
        isActive: true,
      });
    }

    let branch = await BranchModel.findOne({ code: 'CSE' });
    if (!branch) {
      branch = await BranchModel.create({
        name: 'Computer Science & Engineering',
        code: 'CSE',
        slug: 'cse',
        totalSemesters: 8,
        order: 1,
      });
    }

    let sem = await SemesterModel.findOne({ number: 5 });
    if (!sem) {
      sem = await SemesterModel.create({
        number: 5,
        name: 'Semester 5',
        slug: 'sem-5',
      });
    }

    const server = http.createServer(app);
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const port = (server.address() as any).port;
    const baseUrl = `http://localhost:${port}/api/v1`;

    logger.info(`Test server listening on ${baseUrl}`);

    // Helper for fetch
    const request = async (path: string, options: any = {}) => {
      const res = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      });
      const data: any = await res.json().catch(() => null);
      return { status: res.status, data, headers: res.headers };
    };

    // 1. Healthcheck
    logger.info('1️⃣ Testing Health Check...');
    const health: any = await fetch(`http://localhost:${port}/health`).then((r) => r.json());
    if (health.status !== 'healthy') throw new Error('Health check failed');
    logger.info('   ✅ Health Check passed.');

    // 2. Public Academic Hierarchy
    logger.info('2️⃣ Testing Academic Hierarchy Endpoints...');
    const branches = await request('/branches');
    if (branches.status !== 200 || !branches.data?.success) throw new Error('Failed to fetch branches');
    logger.info(`   ✅ Branches endpoint returned ${branches.data.data.length} branches.`);

    const semesters = await request('/semesters');
    if (semesters.status !== 200 || !semesters.data?.success) throw new Error('Failed to fetch semesters');
    logger.info(`   ✅ Semesters endpoint returned ${semesters.data.data.length} semesters.`);

    const subjects = await request('/subjects');
    if (subjects.status !== 200 || !subjects.data?.success) throw new Error('Failed to fetch subjects');
    logger.info(`   ✅ Subjects endpoint returned ${subjects.data.data.length} subjects.`);

    // 3. Universal Search
    logger.info('3️⃣ Testing Universal Search Aggregation...');
    const searchRes = await request('/search?q=database');
    if (searchRes.status !== 200 || !searchRes.data?.success) throw new Error('Search failed');
    logger.info(`   ✅ Universal search returned ${searchRes.data.data.items.length} items for query "database".`);

    // 4. Public Leads Submission
    logger.info('4️⃣ Testing Public Lead Submission...');
    const leadRes = await request('/leads/submit', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'Test Candidate',
        email: 'test.candidate@test.com',
        phone: '+91 99999 88888',
        inquiryType: 'DEMO_CLASS',
        message: 'Automated verification test inquiry.',
      }),
    });
    if (leadRes.status !== 201 || !leadRes.data?.success) throw new Error('Lead submission failed');
    logger.info('   ✅ Lead submission succeeded with 201 Created.');

    // 5. Admin Authentication Flow
    logger.info('5️⃣ Testing Admin Authentication & Cookie Session Flow...');
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@engineering.edu',
        password: 'Admin@12345',
      }),
    });
    if (loginRes.status !== 200 || !loginRes.data?.success) throw new Error(`Admin login failed: ${loginRes.data?.message}`);
    const token = loginRes.data.data.token;
    logger.info(`   ✅ Admin login succeeded. Received bearer token: ${token.substring(0, 10)}...`);

    // 6. Authenticated /me endpoint
    logger.info('6️⃣ Testing /auth/me with Bearer token...');
    const meRes = await request('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (meRes.status !== 200 || !meRes.data?.success) throw new Error('Auth verification failed');
    logger.info(`   ✅ Authenticated as: ${meRes.data.data.name || meRes.data.data.email} (${meRes.data.data.role})`);

    // 7. Admin Dashboard Overview
    logger.info('7️⃣ Testing Admin Dashboard Analytics Aggregator...');
    const dashRes = await request('/analytics/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (dashRes.status !== 200 || !dashRes.data?.success) throw new Error('Dashboard analytics failed');
    logger.info(`   ✅ Dashboard telemetry: Total resources: ${dashRes.data.data.content?.totalResources || 0}, Leads: ${dashRes.data.data.leads?.total || 0}`);

    // 8. Admin Audit Logs
    logger.info('8️⃣ Testing Admin Audit Trail...');
    const auditRes = await request('/audit-logs', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (auditRes.status !== 200 || !auditRes.data?.success) throw new Error('Audit logs fetch failed');
    logger.info(`   ✅ Audit trail contains ${auditRes.data.data.length || 0} recorded operations.`);

    // 9. Jobs & Careers Hub Endpoints
    logger.info('9️⃣ Testing Jobs API & Admin Creation Flow...');
    const publicJobs = await request('/jobs');
    if (publicJobs.status !== 200 || !publicJobs.data?.success) throw new Error('Public jobs fetch failed');
    logger.info(`   ✅ Public jobs endpoint returned ${publicJobs.data.data.length} active jobs.`);

    // Test creating a new job through Admin API
    const newJobRes = await request('/jobs', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: 'Associate, ML Data Operations',
        companyName: 'Amazon',
        location: 'Hyderabad / Pune / Hybrid',
        salaryRange: '₹4.5 - 7.5 LPA',
        jobType: 'OFF_CAMPUS',
        workMode: 'HYBRID',
        applyUrl: 'https://www.amazon.jobs/en/jobs/3134249/associate-ml-data-operations-go-ai-operations',
        whatsappCommunityUrl: 'https://whatsapp.com/channel/0029Vb83otN1SWsvTKibxi1d',
        eligibility: 'Freshers & Experienced',
        description: 'Amazon is hiring for Associate, ML Data Operations role.',
        deadline: '2026-12-31',
        status: 'PUBLISHED',
      }),
    });
    if (newJobRes.status !== 201 || !newJobRes.data?.success) throw new Error(`Job creation failed: ${newJobRes.data?.message}`);
    logger.info(`   ✅ Admin job creation succeeded for Amazon role (ID: ${newJobRes.data.data._id})`);

    // Test track apply click
    const applyClickRes = await request(`/jobs/apply/${newJobRes.data.data._id}`, { method: 'POST' });
    if (applyClickRes.status !== 200) throw new Error('Apply click tracking failed');
    logger.info('   ✅ Job application click tracking verified.');

    logger.info('✨ ALL BACKEND API AUTOMATED TESTS PASSED WITH 100% SUCCESS! 🚀');

    server.close();
    await disconnectDatabase();
    process.exit(0);
  } catch (err) {
    logger.error('❌ Test suite failed:', err);
    await disconnectDatabase();
    process.exit(1);
  }
}

runTests();
