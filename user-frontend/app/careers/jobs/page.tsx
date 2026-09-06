import Link from 'next/link';
import { getJobs, getBranches } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Briefcase, MapPin, Building2, Calendar, DollarSign, ExternalLink, Search, Filter } from 'lucide-react';

export const metadata = {
  title: 'Engineering Job Board & Internships | Apex Engineering Academy',
  description: 'Verified tech, core engineering, off-campus drives, and internships for engineering graduates and students.',
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ branchId?: string; jobType?: string; workMode?: string; search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const [jobsRes, branchesRes] = await Promise.all([
    getJobs({
      branchId: params.branchId,
      jobType: params.jobType,
      workMode: params.workMode,
      search: params.search,
      page: params.page ? parseInt(params.page) : 1,
      limit: 12,
    }).catch(() => ({ items: [], total: 0, pages: 1 })),
    getBranches().catch(() => []),
  ]);

  const jobs = jobsRes.items || [];
  const branches = Array.isArray(branchesRes) ? branchesRes : [];

  return (
    <div className="min-h-screen py-10">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-text-muted mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/careers" className="hover:text-primary transition-colors">Careers</Link>
          <span>/</span>
          <span className="text-text-primary">Job Board</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <Badge variant="accent" className="mb-2">
              <Briefcase className="w-3.5 h-3.5 mr-1" /> Verified Engineering Roles
            </Badge>
            <h1 className="text-3xl md:text-4xl font-black text-text-primary font-display">
              Engineering <span className="gradient-text">Job Board & Drives</span>
            </h1>
            <p className="text-text-secondary text-sm md:text-base mt-2 max-w-xl">
              Verified campus, off-campus, and startup openings across Software, Embedded, Core Mechanical, VLSI, and Analytics.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl bg-surface border border-border mb-8 shadow-sm">
          <form method="GET" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                name="search"
                defaultValue={params.search || ''}
                placeholder="Job title, company, skills..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-surface-elevated border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <select
                name="branchId"
                defaultValue={params.branchId || ''}
                className="w-full px-3 py-2 text-xs rounded-xl bg-surface-elevated border border-border text-text-primary focus:outline-none focus:border-primary"
              >
                <option value="">All Eligible Branches</option>
                {branches.map((b: any) => (
                  <option key={b._id} value={b._id}>
                    {b.code} ({b.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                name="jobType"
                defaultValue={params.jobType || ''}
                className="w-full px-3 py-2 text-xs rounded-xl bg-surface-elevated border border-border text-text-primary focus:outline-none focus:border-primary"
              >
                <option value="">All Employment Types</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="CONTRACT">Contract</option>
              </select>
            </div>

            <div className="flex gap-2">
              <select
                name="workMode"
                defaultValue={params.workMode || ''}
                className="w-full px-3 py-2 text-xs rounded-xl bg-surface-elevated border border-border text-text-primary focus:outline-none focus:border-primary"
              >
                <option value="">All Work Modes</option>
                <option value="ON_SITE">On-Site</option>
                <option value="HYBRID">Hybrid</option>
                <option value="REMOTE">Remote</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors shrink-0"
              >
                Apply Filter
              </button>
            </div>
          </form>
        </div>

        {/* Job Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {jobs.map((job: any) => (
            <div
              key={job._id || job.slug}
              id={job.slug}
              className="p-6 rounded-2xl bg-surface border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-surface-elevated border border-border flex items-center justify-center font-black text-primary text-lg">
                      {job.companyName?.slice(0, 2).toUpperCase() || 'CO'}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-text-primary">{job.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                        <Building2 className="w-3.5 h-3.5" />
                        <span className="font-semibold text-text-secondary">{job.companyName}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={job.jobType === 'INTERNSHIP' ? 'warning' : 'primary'}>
                    {job.jobType?.replace('_', ' ')}
                  </Badge>
                </div>

                <p className="text-xs text-text-secondary line-clamp-3 mb-4">
                  {job.description}
                </p>

                {/* Job Metadata Chips */}
                <div className="grid grid-cols-2 gap-2 text-xs text-text-muted mb-4 p-3 rounded-xl bg-surface-elevated/50 border border-border">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    <span className="truncate">{job.location || 'Pan India'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <DollarSign className="w-3.5 h-3.5 text-success shrink-0" />
                    <span className="font-semibold text-text-primary truncate">{job.salaryRange || 'Disclosed on interview'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Calendar className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    <span className="truncate">Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Rolling'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <span className="truncate">{job.workMode}</span>
                  </div>
                </div>

                {/* Skills tags */}
                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {job.skills.map((skill: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 text-[10px] rounded-md bg-surface-elevated text-text-muted border border-border">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <span className="text-[11px] text-text-muted">
                  {job.applicantsCount || 0} students clicked
                </span>
                <a
                  href={job.applyUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors inline-flex items-center gap-1.5 shadow-sm"
                >
                  <span>Apply Now</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}

          {jobs.length === 0 && (
            <div className="col-span-full py-16 text-center text-text-muted bg-surface/50 rounded-2xl border border-dashed border-border">
              <Briefcase className="w-12 h-12 mx-auto text-text-muted/50 mb-3" />
              <h3 className="font-bold text-text-primary text-base">No Job Openings Found</h3>
              <p className="text-xs mt-1">Try clearing filters or search keywords to view all drives.</p>
              <Link
                href="/careers/jobs"
                className="mt-4 inline-block px-4 py-2 rounded-xl bg-surface-elevated text-xs font-semibold text-text-primary border border-border"
              >
                Reset Filters
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
