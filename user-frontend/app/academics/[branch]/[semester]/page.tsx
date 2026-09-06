import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBranches, getSemesters, getSubjects } from '@/lib/api';
import { Layers, BookOpen, FileText, Video, ArrowRight, ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default async function SemesterSubjectsPage({
  params,
}: {
  params: Promise<{ branch: string; semester: string }>;
}) {
  const { branch: branchSlug, semester: semesterNumStr } = await params;
  const semesterNum = parseInt(semesterNumStr, 10) || 1;

  const [branches, semesters] = await Promise.all([getBranches().catch(() => []), getSemesters().catch(() => [])]);

  const activeBranch = branches.find((b: any) => b.slug === branchSlug);
  const activeSemester = semesters.find((s: any) => s.number === semesterNum);

  if (!activeBranch) {
    notFound();
  }

  const subjects = activeBranch?._id && activeSemester?._id
    ? await getSubjects({ branchId: activeBranch._id, semesterId: activeSemester._id }).catch(() => [])
    : [];

  return (
    <div className="min-h-screen py-10 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/academics" className="hover:text-blue-600 flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" /> Academics
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{activeBranch.name}</span>
          <span>/</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">Semester {semesterNum}</span>
        </div>

        {/* Header Title & Semester Quick Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="primary" size="md">
                {activeBranch.code}
              </Badge>
              <Badge variant="outline" size="md">
                Semester {semesterNum}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {activeBranch.name} — Semester {semesterNum}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
              Select a subject below to access unit-wise syllabus breakdowns, formula sheets, previous year solved papers, and lecture videos.
            </p>
          </div>

          {/* Semester Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <Link
                key={s}
                href={`/academics/${branchSlug}/${s}`}
                className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                  semesterNum === s
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                Sem {s}
              </Link>
            ))}
          </div>
        </div>

        {/* Subjects List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.length > 0 ? (
            subjects.map((sub: any) => (
              <div
                key={sub._id}
                className="flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500/80 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant="primary" size="sm">
                      {sub.code}
                    </Badge>
                    <span className="text-xs text-slate-500">{sub.credits} Credits</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                    {sub.name}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {sub.description || sub.syllabusOverview || 'Comprehensive university curriculum.'}
                  </p>

                  {/* Units Count */}
                  {sub.units && (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500">
                      <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                      <span>{sub.units.length} Syllabus Units Defined</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link href={`/academics/${branchSlug}/${semesterNum}/${sub.slug}`}>
                    <Button variant="outline" size="sm" className="w-full justify-between font-semibold group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                      <span>Open Subject Hub & PYQs</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
              <BookOpen className="w-12 h-12 mx-auto text-slate-400 mb-3" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                Subjects are currently being added for Semester {semesterNum}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Check Semester 5 or Semester 1 for complete loaded curriculum data and solved PYQ papers.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
