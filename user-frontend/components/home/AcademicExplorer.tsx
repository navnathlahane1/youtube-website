'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, ChevronRight, Layers, GraduationCap, ArrowRight, Laptop, Cpu, BrainCircuit, Radio, Cog, Building2 } from 'lucide-react';
import { getBranches, getSemesters, getSubjects } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';

export function AcademicExplorer() {
  const [selectedBranchSlug, setSelectedBranchSlug] = useState<string>('cse');
  const [selectedSemesterNum, setSelectedSemesterNum] = useState<number>(5);

  const { data: branches, isLoading: loadingBranches } = useQuery({
    queryKey: ['branches'],
    queryFn: getBranches,
  });

  const activeBranch = branches?.find((b: any) => b.slug === selectedBranchSlug) || branches?.[0];

  const { data: subjects, isLoading: loadingSubjects } = useQuery({
    queryKey: ['subjects', activeBranch?._id, selectedSemesterNum],
    queryFn: async () => {
      if (!activeBranch?._id) return [];
      const sems = await getSemesters();
      const targetSem = sems?.find((s: any) => s.number === selectedSemesterNum);
      if (!targetSem) return [];
      return getSubjects({ branchId: activeBranch._id, semesterId: targetSem._id });
    },
    enabled: !!activeBranch?._id,
  });

  const branchIcons: Record<string, any> = {
    cse: Laptop,
    it: Cpu,
    aids: BrainCircuit,
    etc: Radio,
    mech: Cog,
    civil: Building2,
  };

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full mb-3">
              <Layers className="w-3.5 h-3.5" /> Academic Hierarchy Navigator
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Explore Your Engineering Syllabus & Resources
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-2xl">
              Select your engineering branch and semester to instantly access unit breakdowns, syllabus weightage, solved university papers, and handwritten revision notes.
            </p>
          </div>
          <Link
            href="/academics"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
          >
            Full Academic Directory <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 1. Branch Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {loadingBranches
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-44 shrink-0 rounded-xl" />
              ))
            : branches?.map((b: any) => {
                const Icon = branchIcons[b.slug] || Laptop;
                const isSelected = selectedBranchSlug === b.slug;

                return (
                  <button
                    key={b._id}
                    onClick={() => setSelectedBranchSlug(b.slug)}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-blue-500'}`} />
                    <span>{b.code}</span>
                    <span className="hidden sm:inline-block font-normal text-xs opacity-80">({b.name.split(' ')[0]})</span>
                  </button>
                );
              })}
        </div>

        {/* 2. Semester Pills (1 to 8) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 text-xs font-semibold">
          <span className="text-slate-500 dark:text-slate-400 mr-1 shrink-0">Semester:</span>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <button
              key={num}
              onClick={() => setSelectedSemesterNum(num)}
              className={`px-3.5 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer ${
                selectedSemesterNum === num
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Sem {num}
            </button>
          ))}
        </div>

        {/* 3. Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingSubjects ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-1/3 rounded-md" />
                <Skeleton className="h-16 w-full rounded-md" />
              </div>
            ))
          ) : subjects && subjects.length > 0 ? (
            subjects.map((sub: any) => (
              <Link
                key={sub._id}
                href={`/academics/${selectedBranchSlug}/${selectedSemesterNum}/${sub.slug}`}
                className="group flex flex-col justify-between p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-slate-900 hover:shadow-xl hover:shadow-blue-500/5 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="primary" size="sm">
                      {sub.code}
                    </Badge>
                    <span className="text-xs text-slate-500">{sub.credits} Credits</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                    {sub.name}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {sub.description || 'Complete syllabus, unit breakdowns, formula cheat sheets, and PYQs.'}
                  </p>

                  {/* Unit summary pills */}
                  {sub.units && sub.units.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-xs text-slate-500">
                      <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                      <span>{sub.units.length} Syllabus Units Breakdown</span>
                    </div>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span>Open Subject Hub & PYQs</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              <GraduationCap className="w-10 h-10 mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Syllabus & resources are being uploaded for Semester {selectedSemesterNum}
              </p>
              <p className="text-xs text-slate-500 mt-1">Try switching to Semester 5 or Semester 1 to view populated curriculum.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
