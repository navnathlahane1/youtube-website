'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Download, Bookmark, Search, ArrowRight } from 'lucide-react';
import { getNotes, getBranches, getSemesters } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { useBookmarksStore } from '@/lib/store/bookmarks-store';

export default function NotesListingPage() {
  const [search, setSearch] = useState('');
  const [branchId, setBranchId] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const { toggleBookmark, isBookmarked } = useBookmarksStore();

  const { data: branches } = useQuery({ queryKey: ['branches'], queryFn: getBranches });
  const { data: semesters } = useQuery({ queryKey: ['semesters'], queryFn: () => getSemesters() });

  const { data: noteData, isLoading } = useQuery({
    queryKey: ['notes-page', branchId, semesterId, search],
    queryFn: () =>
      getNotes({
        branchId: branchId || undefined,
        semesterId: semesterId || undefined,
        search: search || undefined,
        limit: 20,
      }),
  });

  return (
    <div className="min-h-screen py-10 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full mb-3">
            <BookOpen className="w-3.5 h-3.5" /> High-Yield Revision Sheets
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Handwritten & Faculty Lecture Notes
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-3xl">
            Download unit-wise handwritten summaries, formula cheat sheets, and solved numerical booklets authored by top rankers and senior professors.
          </p>
        </div>

        {/* Filters */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-8 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Input
              type="text"
              placeholder="Search by topic, unit, or author..."
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
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-60 w-full rounded-2xl" />)
          ) : noteData?.items?.length > 0 ? (
            noteData.items.map((n: any) => {
              const saved = isBookmarked(n._id);
              return (
                <div
                  key={n._id}
                  className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-blue-500/80 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <Badge variant={n.isHandwritten ? 'accent' : 'primary'} size="sm">
                        {n.isHandwritten ? 'Handwritten' : 'Master Note'}
                      </Badge>
                      <button
                        onClick={() =>
                          toggleBookmark({
                            id: n._id,
                            type: 'note',
                            title: n.title,
                            slug: n.slug,
                            url: `/notes/${n.slug}`,
                            subtitle: n.authorName,
                            badge: n.isHandwritten ? 'Handwritten' : 'PDF Note',
                          })
                        }
                        className={`p-1.5 rounded-lg transition-colors ${
                          saved ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/60' : 'text-slate-400 hover:text-blue-600'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${saved ? 'fill-blue-600' : ''}`} />
                      </button>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {n.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{n.authorName || 'Faculty Note'}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{n.pageCount || 24} pages</span>
                    <Link href={`/notes/${n.slug}`}>
                      <Button size="sm" variant="outline" className="text-xs font-semibold">
                        Read Note <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              <BookOpen className="w-10 h-10 mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No notes found for this filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
