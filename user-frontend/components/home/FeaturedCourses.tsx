'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, Calendar, Clock, MapPin, Users, ArrowRight, CheckCircle, GraduationCap } from 'lucide-react';
import { getCourses } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

export function FeaturedCourses() {
  const { data: courses, isLoading } = useQuery({
    queryKey: ['featured-courses'],
    queryFn: () => getCourses({ featured: true }),
  });

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Offline Classroom Batches
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Featured Classroom Coaching Programs
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-2xl">
              Intensive offline batches at our Tech Park learning center with small batch sizes, printed materials, and direct mentor attention.
            </p>
          </div>
          <Link href="/courses" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline shrink-0">
            View All Courses & Batches <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                <Skeleton className="h-44 w-full rounded-2xl" />
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <Skeleton className="h-16 w-full rounded-md" />
              </div>
            ))
          ) : courses && courses.length > 0 ? (
            courses.map((course: any) => {
              const activeBatch = course.batches?.[0];

              return (
                <div
                  key={course._id}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all group"
                >
                  <div>
                    {/* Header Banner / Badge */}
                    <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <Badge variant="accent" size="sm" className="font-bold">
                          {course.category}
                        </Badge>
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                          {course.durationMonths} Months Duration
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {course.tagline || course.description}
                      </p>
                    </div>

                    {/* Batch Info & Amenities */}
                    <div className="p-6 space-y-4 text-xs">
                      {activeBatch && (
                        <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 space-y-2">
                          <div className="flex items-center justify-between font-semibold text-blue-900 dark:text-blue-200">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-blue-600" /> {activeBatch.batchName}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px]">
                              {activeBatch.availableSeats} Seats Left
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <Clock className="w-3.5 h-3.5 text-blue-500" /> {activeBatch.timing}
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <MapPin className="w-3.5 h-3.5 text-blue-500" /> {activeBatch.classroomLocation}
                          </div>
                        </div>
                      )}

                      {/* Course Features */}
                      <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        {course.features?.slice(0, 3).map((feat: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Pricing & CTA Footer */}
                  <div className="p-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs text-slate-400 line-through">₹{course.price?.original?.toLocaleString()}</div>
                      <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                        ₹{course.price?.discounted?.toLocaleString() || course.price?.original?.toLocaleString()}
                      </div>
                    </div>
                    <Link href={`/courses/${course.slug}`}>
                      <Button size="sm" variant="accent" className="font-bold shadow-md shadow-amber-500/20">
                        View Batch Details →
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })
          ) : null}
        </div>
      </div>
    </section>
  );
}
