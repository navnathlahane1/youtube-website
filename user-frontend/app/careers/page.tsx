import Link from 'next/link';
import { getCareerRoadmaps, getJobs } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Compass, Briefcase, ChevronRight, BookOpen, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Engineering Career Hub & Roadmaps | Apex Engineering Academy',
  description: 'Curated engineering career roadmaps, GATE guides, PSU strategies, and top tier software & hardware job listings.',
};

export default async function CareersPage() {
  const [roadmapsRes, jobsRes] = await Promise.all([
    getCareerRoadmaps().catch(() => []),
    getJobs({ limit: 4 }).catch(() => ({ items: [] })),
  ]);

  const roadmaps = Array.isArray(roadmapsRes) ? roadmapsRes : [];
  const jobs = jobsRes?.items || [];

  return (
    <div className="min-h-screen py-10">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-text-muted mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text-primary">Careers & Roadmaps</span>
        </nav>

        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden p-8 md:p-12 mb-12 bg-gradient-to-br from-surface-elevated via-surface to-surface border border-border">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <Badge variant="primary" className="mb-4">
              <Compass className="w-3.5 h-3.5 mr-1" /> Career Launchpad
            </Badge>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-text-primary mb-4 font-display">
              Navigate Your <span className="gradient-text">Engineering Career</span>
            </h1>
            <p className="text-text-secondary text-base md:text-lg mb-8 leading-relaxed">
              Step-by-step roadmaps from 1st year foundation to FAANG software engineering, GATE AIR top 100, Core Mechanical/Electrical design, and Tier-1 tech placements.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/careers/jobs"
                className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20 inline-flex items-center gap-2 text-sm"
              >
                <Briefcase className="w-4 h-4" /> Explore Active Job Openings
              </Link>
              <Link
                href="/career-counselling"
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors shadow-lg shadow-purple-600/20 inline-flex items-center gap-2 text-sm"
              >
                <Compass className="w-4 h-4" /> Free Career Counselling
              </Link>
              <a
                href="#roadmaps"
                className="px-6 py-3 rounded-xl bg-surface-elevated text-text-primary font-semibold hover:border-primary/50 transition-colors border border-border inline-flex items-center gap-2 text-sm"
              >
                <BookOpen className="w-4 h-4" /> Browse Roadmaps
              </a>
            </div>
          </div>
        </div>

        {/* Career Counselling Highlight Banner */}
        <div className="mb-12 p-6 rounded-3xl bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-slate-900/90 border border-purple-500/30 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-500 text-white">
              ★ 1-on-1 Guidance Desk
            </span>
            <h3 className="text-xl font-bold text-white">Not Sure Which Engineering Path Fits You?</h3>
            <p className="text-xs text-purple-200 max-w-xl">
              Take our interactive AI Career Assessment or book a free 1-on-1 session with Ex-IITian faculty at our Pune learning center.
            </p>
          </div>
          <Link
            href="/career-counselling"
            className="px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs transition-colors shrink-0 shadow-lg flex items-center gap-1.5"
          >
            Start Career Assessment <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-surface border border-border flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-text-primary">{roadmaps.length || 6}+</p>
              <p className="text-xs text-text-muted">Structured Specialization Paths</p>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-surface border border-border flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-text-primary">{jobs.length > 0 ? '50+' : '20+'}</p>
              <p className="text-xs text-text-muted">Verified Engineering Drives</p>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-surface border border-border flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-text-primary">₹18.5 LPA</p>
              <p className="text-xs text-text-muted">Avg Top Batch Placement</p>
            </div>
          </div>
        </div>

        {/* Roadmaps Section */}
        <section id="roadmaps" className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Step-by-Step Roadmaps</h2>
              <p className="text-text-muted text-sm mt-1">Multi-stage milestones, recommended subjects, and tech stacks</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roadmaps.map((item: any) => (
              <Link
                key={item._id || item.slug}
                href={`/careers/roadmaps/${item.slug}`}
                className="group p-6 rounded-2xl bg-surface border border-border hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant={item.type === 'GATE_PREP' ? 'warning' : 'primary'}>
                      {item.type.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-text-muted flex items-center gap-1 font-mono">
                      {item.stages?.length || 4} Stages
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary line-clamp-3 mb-6">
                    {item.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {item.stages?.slice(0, 3).map((stage: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-text-muted">
                        <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                        <span className="truncate">{stage.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-primary">
                  <span>View Full Roadmap</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}

            {roadmaps.length === 0 && (
              <div className="col-span-full py-12 text-center text-text-muted bg-surface/50 rounded-2xl border border-dashed border-border">
                No published career roadmaps yet. Check back soon!
              </div>
            )}
          </div>
        </section>

        {/* Featured Jobs Teaser */}
        <section className="p-8 rounded-3xl bg-surface-elevated border border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <Badge variant="accent" className="mb-2">Verified Openings</Badge>
              <h2 className="text-2xl font-bold text-text-primary">Featured Engineering Jobs</h2>
              <p className="text-sm text-text-muted">Full-time, Internship & Off-Campus drives for freshers and 2024-2026 batches</p>
            </div>
            <Link
              href="/careers/jobs"
              className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View All Jobs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job: any) => (
              <div
                key={job._id || job.slug}
                className="p-5 rounded-xl bg-surface border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-text-primary">{job.companyName}</span>
                    <span className="text-xs text-text-muted">•</span>
                    <span className="text-xs text-text-muted">{job.location}</span>
                  </div>
                  <h4 className="font-bold text-text-primary text-base mb-1">{job.title}</h4>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="text-accent font-semibold">{job.salaryRange || 'Best in Industry'}</span>
                    <span className="text-text-muted">•</span>
                    <span className="text-text-secondary">{job.jobType}</span>
                  </div>
                </div>
                <Link
                  href={`/careers/jobs#${job.slug}`}
                  className="px-4 py-2 rounded-lg bg-surface-elevated hover:bg-primary hover:text-white text-xs font-semibold text-text-primary transition-colors border border-border shrink-0"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
