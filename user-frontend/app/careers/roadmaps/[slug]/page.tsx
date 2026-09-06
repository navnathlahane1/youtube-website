import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Compass, CheckCircle2, ChevronLeft, ArrowRight, ExternalLink, Sparkles, BookOpen, Layers } from 'lucide-react';
import { getCareerBySlug } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const roadmap = await getCareerBySlug(slug).catch(() => null);
  if (!roadmap) return { title: 'Career Roadmap' };

  return {
    title: `${roadmap.title} | Engineering Career Guide`,
    description: roadmap.summary,
  };
}

export default async function CareerRoadmapDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const roadmap = await getCareerBySlug(slug).catch(() => null);

  if (!roadmap) {
    notFound();
  }

  return (
    <div className="min-h-screen py-10 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/careers" className="hover:text-blue-600 flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" /> Career Hub
          </Link>
          <span>/</span>
          <span className="font-semibold text-cyan-600 dark:text-cyan-400 truncate">{roadmap.domain}</span>
        </div>

        {/* Roadmap Header Card */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-10 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" size="md">
              {roadmap.type}
            </Badge>
            <span className="text-xs font-semibold text-slate-500">{roadmap.targetYearOrRole}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
            {roadmap.title}
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
            {roadmap.summary}
          </p>

          {/* Tools and Technologies */}
          {roadmap.toolsAndTechnologies && (
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Core Technologies:</span>
              <div className="flex flex-wrap gap-2">
                {roadmap.toolsAndTechnologies.map((tool: string) => (
                  <span
                    key={tool}
                    className="px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step-by-Step Stages Timeline */}
        {roadmap.stages && roadmap.stages.length > 0 && (
          <div className="space-y-6 mb-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-500" /> Structured Stage-by-Stage Path
            </h2>

            <div className="space-y-4">
              {roadmap.stages.map((stage: any) => (
                <div
                  key={stage.stageNumber}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                      {stage.stageNumber}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{stage.title}</h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-11">
                    {stage.description}
                  </p>

                  {/* Key Skills */}
                  {stage.keySkills && stage.keySkills.length > 0 && (
                    <div className="pl-11 pt-1 flex flex-wrap gap-1.5">
                      {stage.keySkills.map((sk: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-cyan-50 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-900/60"
                        >
                          ✓ {sk}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Free recommended resources */}
                  {stage.recommendedFreeResources && stage.recommendedFreeResources.length > 0 && (
                    <div className="pl-11 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-3 text-xs">
                      {stage.recommendedFreeResources.map((res: any, rIdx: number) => (
                        <a
                          key={rIdx}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                        >
                          <BookOpen className="w-3.5 h-3.5" /> {res.title} <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Offline Center Placement Track CTA */}
        <div className="p-7 rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-center md:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Want In-Person Mentorship?
            </div>
            <h3 className="text-xl font-bold">Join Our Offline Placement Accelerator Track</h3>
            <p className="text-xs text-slate-300 max-w-xl">
              10+ live cloud projects, weekly 1-on-1 mock interviews, and direct referral drives in Pune.
            </p>
          </div>
          <Link href="/courses" className="shrink-0">
            <Button variant="accent" size="md" className="font-bold shadow-lg">
              Explore Placement Batch →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
