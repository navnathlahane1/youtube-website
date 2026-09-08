import React from 'react';
import Link from 'next/link';
import { getJobs } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  ExternalLink,
  ArrowRight,
  Sparkles,
  MessageCircle,
  GraduationCap,
  CheckCircle2,
  Calendar,
  Share2,
} from 'lucide-react';

export async function FeaturedJobsSection() {
  const jobsRes = await getJobs({ limit: 4 }).catch(() => ({ items: [] }));
  const jobs = jobsRes?.items && jobsRes.items.length > 0 ? jobsRes.items : [];

  return (
    <section className="py-20 bg-slate-900/50 border-y border-slate-800/80 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-48 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Campus & Off-Campus Hiring Hub 2026</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-display">
              Latest Engineering <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Jobs & Drives</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
              Verified campus placement drives, off-campus hiring, and internships for freshers and engineering students across top tech companies.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/careers/jobs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore All Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* WhatsApp Community VIP Alert Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border border-emerald-500/30 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-sm font-bold text-white">Join WhatsApp Career Community</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500 text-slate-950 animate-pulse">
                  Live Updates
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Instant alerts for Amazon, Google, NVIDIA off-campus drives, direct apply links, and interview prep.
              </p>
            </div>
          </div>

          <a
            href="https://whatsapp.com/channel/0029Vb83otN1SWsvTKibxi1d?utm_source=chatgpt.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-extrabold transition-all shadow-lg shadow-emerald-500/20 shrink-0 inline-flex items-center gap-2 hover:scale-105"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Join WhatsApp Community</span>
          </a>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {jobs.map((job: any) => {
            const isAmazon = job.companyName?.toLowerCase().includes('amazon');
            return (
              <div
                key={job._id || job.slug}
                className={`group relative p-6 rounded-2xl bg-slate-900 border transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-blue-500/10 ${
                  isAmazon
                    ? 'border-amber-500/40 hover:border-amber-400/80 bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/20'
                    : 'border-slate-800 hover:border-blue-500/50'
                }`}
              >
                <div>
                  {/* Top Bar: Company, Type & Salary */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg border ${
                          isAmazon
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                            : 'bg-blue-600/10 border-blue-500/20 text-blue-400'
                        }`}
                      >
                        {isAmazon ? 'AMZ' : job.companyName?.slice(0, 3).toUpperCase() || 'JOB'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-400">{job.companyName}</span>
                          {isAmazon && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                              🔥 Hot Opening
                            </span>
                          )}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                          {job.title}
                        </h3>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wide shrink-0 ${
                        job.jobType === 'INTERNSHIP'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : job.jobType === 'OFF_CAMPUS'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {job.jobType ? job.jobType.replace('_', ' ') : 'OFF-CAMPUS'}
                    </span>
                  </div>

                  {/* Highlights / Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs mb-4">
                    <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-800/60 text-slate-300 border border-slate-700/50">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="font-bold text-emerald-400 truncate font-mono">
                        {job.salaryRange || job.salaryOrStipend || 'Competitive'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-800/60 text-slate-300 border border-slate-700/50">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{job.location || 'Pan India / Hybrid'}</span>
                    </div>

                    <div className="col-span-2 sm:col-span-1 flex items-center gap-1.5 p-2 rounded-xl bg-slate-800/60 text-slate-300 border border-slate-700/50">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">{job.eligibility || 'Freshers & 2026 Batch'}</span>
                    </div>
                  </div>

                  {/* Description Snippet */}
                  <div className="text-xs text-slate-400 line-clamp-3 mb-6 leading-relaxed whitespace-pre-line">
                    {job.description}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    <span>{job.applicantsCount || job.clickCount || 120}+ students applied</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/careers/jobs#${job.slug}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                    >
                      Details
                    </Link>

                    <a
                      href={job.applyUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-md shadow-blue-600/30"
                    >
                      <span>Apply Official</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer CTAs */}
        <div className="text-center">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>Explore Engineering Career Roadmaps & Interview Prep Guides</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
