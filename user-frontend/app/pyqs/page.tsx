'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { FileText, Download, Eye, Bookmark, Search, ArrowRight } from 'lucide-react';
import { getPYQs, getBranches, getSemesters } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { useBookmarksStore } from '@/lib/store/bookmarks-store';

export default function PYQsListingPage() {
  const [search, setSearch] = useState('');
  const [branchId, setBranchId] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [year, setYear] = useState<number | undefined>(undefined);
  const { toggleBookmark, isBookmarked } = useBookmarksStore();

  const { data: branches } = useQuery({ queryKey: ['branches'], queryFn: getBranches });
  const { data: semesters } = useQuery({ queryKey: ['semesters'], queryFn: () => getSemesters() });

  const { data: pyqData, isLoading } = useQuery({
    queryKey: ['pyqs-page', branchId, semesterId, year, search],
    queryFn: () =>
      getPYQs({
        branchId: branchId || undefined,
        semesterId: semesterId || undefined,
        year: year || undefined,
        search: search || undefined,
        limit: 20,
      }),
  });

  return (
    <div className="min-h-screen py-10 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full mb-3">
            <FileText className="w-3.5 h-3.5" /> University Solved Papers
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Previous Year Question Papers (PYQs)
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-3xl">
            Download solved university question papers from 2019 to 2025 with step-by-step model answers and marks distributions.
          </p>
        </div>

        {/* Filters */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-8 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input
              type="text"
              placeholder="Search by subject or exam type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs sm:text-sm"
            >
              <option value="">All Branches</option>
              {branches?.map((b: any) => (
                <option key={b._id} value={b._id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>

            <select
              value={semesterId}
              onChange={(e) => setSemesterId(e.target.value)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs sm:text-sm"
            >
              <option value="">All Semesters</option>
              {semesters?.map((s: any) => (
                <option key={s._id} value={s._id}>
                  Semester {s.number}
                </option>
              ))}
            </select>

            <select
              value={year || ''}
              onChange={(e) => setYear(e.target.value ? parseInt(e.target.value, 10) : undefined)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs sm:text-sm"
            >
              <option value="">All Years</option>
              {[2025, 2024, 2023, 2022, 2021, 2020].map((y) => (
                <option key={y} value={y}>
                  Year {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-60 w-full rounded-2xl" />)
          ) : pyqData?.items?.length > 0 ? (
            pyqData.items.map((p: any) => {
              const saved = isBookmarked(p._id);
              return (
                <div
                  key={p._id}
                  className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-amber-500/80 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <Badge variant="accent" size="sm">
                        {p.year} Exam Paper
                      </Badge>
                      <button
                        onClick={() =>
                          toggleBookmark({
                            id: p._id,
                            type: 'pyq',
                            title: p.title,
                            slug: p.slug,
                            url: `/pyqs/${p.slug}`,
                            subtitle: p.examType,
                            badge: `${p.year} Paper`,
                          })
                        }
                        className={`p-1.5 rounded-lg transition-colors ${
                          saved ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60' : 'text-slate-400 hover:text-amber-500'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-500' : ''}`} />
                      </button>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-amber-500 transition-colors line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{p.subjectId?.name || 'Engineering'} • {p.examType}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{p.downloadCount} downloads</span>
                    <Link href={`/pyqs/${p.slug}`}>
                      <Button size="sm" variant="outline" className="text-xs font-semibold">
                        View Solved PDF <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              <FileText className="w-10 h-10 mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No question papers matching your filters</p>
              <p className="text-xs text-slate-500 mt-1">Try resetting the branch or year filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
