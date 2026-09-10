'use client';

import React from 'react';
import { STUDENT_STAGES } from '@/lib/career-counselling-data';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, ArrowRight, GraduationCap, Sparkles } from 'lucide-react';

export function StudentStagesSection({ onStageSelect }: { onStageSelect?: (stageId: string) => void }) {
  return (
    <section id="stages" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-950/60 border-y border-slate-200 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <Badge variant="primary" className="bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800">
            <GraduationCap className="w-3.5 h-3.5 mr-1 text-blue-600 dark:text-blue-400" /> Stage-Specific Strategy
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Career Guidance for Every Engineering Stage
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Your priorities change each semester. Here is how our academic counselling aligns with your current milestone.
          </p>
        </div>

        {/* 5 Stage Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STUDENT_STAGES.map((stage) => (
            <div
              key={stage.stageId}
              className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 hover:border-purple-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    {stage.badge}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 font-semibold">Stage {stage.stageId.toUpperCase()}</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {stage.title}
                  </h3>
                  <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-0.5">
                    {stage.tagline}
                  </p>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {stage.focus}
                </p>

                {/* Key Milestones */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Key Semester Goals:
                  </span>
                  {stage.milestones.map((m, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                <a
                  href="#booking-form"
                  onClick={() => onStageSelect && onStageSelect(stage.stageId)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-between cursor-pointer group-hover:shadow-md"
                >
                  <span>{stage.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}

          {/* Bonus Highlight Card: Offline Center Immersion */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-950 text-white border border-purple-800 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-400 text-slate-950">
                <Sparkles className="w-3.5 h-3.5" /> Pune Offline Center
              </div>

              <h3 className="text-xl font-extrabold text-white">
                Need Face-to-Face Guidance?
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                Visit our FC Road center for in-person faculty evaluations, study room access, printed university formula booklets, and mock placement interviews.
              </p>

              <div className="space-y-2 text-xs text-purple-200 pt-2">
                <p>✓ 1-on-1 Ex-IITian mentor cabin</p>
                <p>✓ Daily 7:30 AM – 8:30 PM counseling desk</p>
                <p>✓ Instant syllabus review & backlog diagnostic</p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-purple-800/80">
              <a
                href="#booking-form"
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all flex items-center justify-between shadow-lg shadow-amber-500/20"
              >
                <span>Book Free Center Visit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
