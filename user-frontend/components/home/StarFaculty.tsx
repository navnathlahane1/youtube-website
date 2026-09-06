'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Award, Star, BookOpen, Linkedin, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getFaculty } from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';

export function StarFaculty() {
  const { data: facultyList, isLoading } = useQuery({
    queryKey: ['faculty-list'],
    queryFn: () => getFaculty(),
  });

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full mb-3">
            <Award className="w-3.5 h-3.5" /> Elite Academic Pedigree
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Learn from Ex-IITian Mentors & Master Educators
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm md:text-base">
            Our full-time resident mentors are accessible everyday in private doubt cabins at our Pune learning center.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-6 w-1/2 rounded-md" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
              </div>
            ))
          ) : facultyList && facultyList.length > 0 ? (
            facultyList.map((f: any) => (
              <div
                key={f._id}
                className="flex flex-col justify-between p-7 rounded-3xl bg-slate-50/70 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-500/80 transition-all group"
              >
                <div>
                  {/* Photo & Rating header */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border-2 border-indigo-500/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={f.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                        alt={f.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{f.name}</h3>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{f.qualification}</p>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{f.studentRating || 4.9}</span>
                        <span className="text-slate-400 font-normal">({f.studentReviewsCount || 300}+ reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Designation & Bio */}
                  <p className="text-xs font-medium text-slate-500 mb-3">{f.designation}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4">{f.bio}</p>

                  {/* Key subjects */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Teaches:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {f.subjectsTaught?.map((sub: string) => (
                        <span
                          key={sub}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{f.experienceYears}+ Years Teaching</span>
                  <Link
                    href="/faculty"
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    Full Profile <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          ) : null}
        </div>
      </div>
    </section>
  );
}
