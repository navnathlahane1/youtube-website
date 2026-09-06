import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Layers, Laptop, Cpu, BrainCircuit, Radio, Cog, Building2, ChevronRight, BookOpen } from 'lucide-react';
import { getBranches, getSemesters } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Engineering Academic Hub | Branches, Semesters & Syllabus',
  description: 'Browse complete engineering syllabus, unit breakdowns, previous year questions, and handwritten notes for CSE, IT, AI&DS, E&TC, Mechanical, and Civil branches.',
};

export default async function AcademicsPage() {
  const branches = await getBranches().catch(() => []);
  const semesters = await getSemesters().catch(() => []);

  const branchIcons: Record<string, any> = {
    cse: Laptop,
    it: Cpu,
    aids: BrainCircuit,
    etc: Radio,
    mech: Cog,
    civil: Building2,
  };

  return (
    <div className="min-h-screen py-12 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumbs & Title */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full mb-3">
            <Layers className="w-3.5 h-3.5" /> University Curriculum Directory
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Engineering Academic Structure
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-3xl leading-relaxed">
            Select an engineering department to browse syllabus information, unit-by-unit marks distribution, faculty revision notes, and past 10-year question papers.
          </p>
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {branches.map((b: any) => {
            const Icon = branchIcons[b.slug] || Laptop;
            return (
              <div
                key={b._id}
                className="flex flex-col justify-between p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500/80 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="primary" size="md" className="font-mono font-bold">
                      {b.code}
                    </Badge>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                    {b.name}
                  </h2>
                  <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {b.description || 'Comprehensive curriculum, unit notes, and exam papers.'}
                  </p>

                  {/* Semesters Quick Links */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                      Select Semester:
                    </p>
                    <div className="grid grid-cols-4 gap-1.5 text-xs font-semibold text-center">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <Link
                          key={s}
                          href={`/academics/${b.slug}/${s}`}
                          className="py-1.5 px-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors"
                        >
                          Sem {s}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500">8 Semesters Curriculum</span>
                  <Link
                    href={`/academics/${b.slug}/5`}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    Open Hub <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
