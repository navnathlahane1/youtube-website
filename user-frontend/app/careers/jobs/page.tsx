import Link from 'next/link';
import { getJobs, getBranches } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import {
  Briefcase,
  MapPin,
  Building2,
  Calendar,
  DollarSign,
  ExternalLink,
  Search,
  MessageCircle,
  Sparkles,
  GraduationCap,
  CheckCircle2,
  Share2,
} from 'lucide-react';

export const metadata = {
  title: 'Engineering Job Board & Off-Campus Hiring 2026 | Apex Engineering Academy',
  description: 'Verified tech, core engineering, off-campus drives, Amazon ML hiring, and internships for engineering graduates and freshers.',
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
      limit: 20,
    }).catch(() => ({ items: [], total: 0, pages: 1 })),
    getBranches().catch(() => []),
  ]);

  const jobs = jobsRes.items || [];
  const branches = Array.isArray(branchesRes) ? branchesRes : [];

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-text-muted mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/careers" className="hover:text-primary transition-colors">Careers</Link>
          <span>/</span>
          <span className="text-text-primary">Job Board & Hiring Drives</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <Badge variant="accent" className="mb-2">
              <Briefcase className="w-3.5 h-3.5 mr-1" /> Verified Engineering Roles & 2026 Hiring
            </Badge>
            <h1 className="text-3xl md:text-4xl font-black text-text-primary font-display">
              Engineering <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">Job Board & Off-Campus Drives</span>
            </h1>
            <p className="text-text-secondary text-sm md:text-base mt-2 max-w-2xl">
              Verified campus, off-campus, and startup openings across Software, Machine Learning, Embedded, Core Mechanical, VLSI, and Analytics.
            </p>
          </div>
        </div>

        {/* WhatsApp Community VIP Alert Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-emerald-950/70 border border-emerald-500/40 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-sm sm:text-base font-bold text-white">Join WhatsApp Off-Campus Jobs Community</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500 text-slate-950 animate-pulse">
                  Daily Drives
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Get daily notifications for Amazon, Google, TCS, and startup off-campus opportunities & application links.
              </p>
            </div>
          </div>

          <a
            href="https://whatsapp.com/channel/0029Vb83otN1SWsvTKibxi1d?utm_source=chatgpt.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-black transition-all shadow-lg shadow-emerald-500/20 shrink-0 inline-flex items-center gap-2 hover:scale-105"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Join WhatsApp Community</span>
          </a>
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
                <option value="OFF_CAMPUS">Off-Campus Hiring</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="CORE_DRIVE">Core Engineering Drive</option>
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
                <option value="HYBRID">Hybrid</option>
                <option value="ON_SITE">On-Site</option>
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
          {jobs.map((job: any) => {
            const isAmazon = job.companyName?.toLowerCase().includes('amazon');
            return (
              <div
                key={job._id || job.slug}
                id={job.slug}
                className={`p-6 rounded-2xl bg-surface border transition-all duration-200 flex flex-col justify-between hover:shadow-xl ${
                  isAmazon ? 'border-amber-500/40 bg-gradient-to-b from-surface via-surface to-amber-950/10' : 'border-border hover:border-primary/40'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-surface-elevated border border-border flex items-center justify-center font-black text-primary text-lg shrink-0">
                        {job.companyName?.slice(0, 3).toUpperCase() || 'CO'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-text-muted">{job.companyName}</span>
                          {isAmazon && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                              🔥 Hot Opening
                            </span>
                          )}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-text-primary">{job.title}</h3>
                      </div>
                    </div>
                    <Badge variant={job.jobType === 'INTERNSHIP' ? 'warning' : 'primary'}>
                      {job.jobType?.replace('_', ' ') || 'OFF CAMPUS'}
                    </Badge>
                  </div>

                  {/* Job Metadata Chips */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-text-muted mb-4 p-3 rounded-xl bg-surface-elevated/50 border border-border">
                    <div className="flex items-center gap-1.5 truncate">
                      <DollarSign className="w-3.5 h-3.5 text-success shrink-0" />
                      <span className="font-bold text-success truncate font-mono">
                        {job.salaryRange || job.salaryOrStipend || 'Competitive'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0" />
                      <span className="truncate">{job.location || 'Pan India'}</span>
                    </div>
                    <div className="col-span-2 sm:col-span-1 flex items-center gap-1.5 truncate">
                      <GraduationCap className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">{job.eligibility || 'Freshers & Experienced'}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="text-xs text-text-secondary mb-4 whitespace-pre-line leading-relaxed">
                    {job.description}
                  </div>

                  {/* Requirements Highlights */}
                  {job.requirements && job.requirements.length > 0 && (
                    <div className="mb-4 p-3 rounded-xl bg-surface-elevated/30 border border-border/70 space-y-1.5">
                      <p className="text-[11px] font-bold text-text-primary uppercase tracking-wider">Key Role Highlights:</p>
                      {job.requirements.slice(0, 3).map((req: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-text-muted">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Selection Process */}
                  {job.selectionRounds && job.selectionRounds.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mb-4 text-[11px] text-text-muted">
                      <span className="font-semibold text-text-secondary">Rounds:</span>
                      {job.selectionRounds.map((round: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-surface-elevated text-text-muted border border-border">
                          {round}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[11px] text-text-muted">
                    {job.applicantsCount || job.clickCount || 0} students applied
                  </span>

                  <div className="flex items-center gap-2">
                    <a
                      href={job.whatsappCommunityUrl || 'https://whatsapp.com/channel/0029Vb83otN1SWsvTKibxi1d?utm_source=chatgpt.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">WhatsApp Alert</span>
                    </a>

                    <a
                      href={job.applyUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-all inline-flex items-center gap-1.5 shadow-md shadow-primary/20 hover:scale-105"
                    >
                      <span>Official Job Application</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}

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
