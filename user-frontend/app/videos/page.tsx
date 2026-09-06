'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Video, Play, Search, ArrowRight } from 'lucide-react';
import { getVideos, getBranches } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';

export default function VideosListingPage() {
  const [search, setSearch] = useState('');
  const [branchId, setBranchId] = useState('');

  const { data: branches } = useQuery({ queryKey: ['branches'], queryFn: getBranches });

  const { data: videoData, isLoading } = useQuery({
    queryKey: ['videos-page', branchId, search],
    queryFn: () =>
      getVideos({
        branchId: branchId || undefined,
        search: search || undefined,
        limit: 20,
      }),
  });

  return (
    <div className="min-h-screen py-10 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-3 py-1 rounded-full mb-3">
            <Video className="w-3.5 h-3.5" /> Video Lectures & Walkthroughs
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Engineering Video Tutorials & Numerical Walkthroughs
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-3xl">
            Watch high-yield problem solving tutorials, DFA construction workshops, and normalization algorithms with topic timestamps.
          </p>
        </div>

        {/* Filters */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-8 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              type="text"
              placeholder="Search video lectures by topic, instructor, or subject..."
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
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)
          ) : videoData?.items?.length > 0 ? (
            videoData.items.map((item: any) => (
              <div
                key={item._id}
                className="flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg hover:border-rose-500 transition-all group"
              >
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.thumbnailUrl || `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-rose-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{item.instructorName || 'Apex Faculty'}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{Math.floor((item.durationSeconds || 1200) / 60)} mins</span>
                    <Link href={`/videos/${item.slug}`}>
                      <Button size="sm" variant="outline" className="text-xs font-semibold text-rose-600">
                        Watch Lecture <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              <Video className="w-10 h-10 mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No video lectures found for this search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
