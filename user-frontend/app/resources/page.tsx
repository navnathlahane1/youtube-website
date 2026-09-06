'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  FileText,
  BookOpen,
  Video,
  FolderGit2,
  Search,
  Filter,
  Download,
  Eye,
  Bookmark,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { getBranches, getSemesters, getPYQs, getNotes, getVideos, getProjects } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { useBookmarksStore } from '@/lib/store/bookmarks-store';

export default function ResourcesPage() {
  const [resourceType, setResourceType] = useState<'all' | 'pyq' | 'note' | 'video' | 'project'>('all');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const { toggleBookmark, isBookmarked } = useBookmarksStore();

  const { data: branches } = useQuery({ queryKey: ['branches'], queryFn: getBranches });
  const { data: semesters } = useQuery({ queryKey: ['semesters'], queryFn: () => getSemesters() });

  const { data: pyqs, isLoading: loadingPyqs } = useQuery({
    queryKey: ['res-pyqs', selectedBranchId, selectedSemesterId, searchQuery],
    queryFn: () =>
      getPYQs({
        branchId: selectedBranchId || undefined,
        semesterId: selectedSemesterId || undefined,
        search: searchQuery || undefined,
        limit: 12,
      }),
    enabled: resourceType === 'all' || resourceType === 'pyq',
  });

  const { data: notes, isLoading: loadingNotes } = useQuery({
    queryKey: ['res-notes', selectedBranchId, selectedSemesterId, searchQuery],
    queryFn: () =>
      getNotes({
        branchId: selectedBranchId || undefined,
        semesterId: selectedSemesterId || undefined,
        search: searchQuery || undefined,
        limit: 12,
      }),
    enabled: resourceType === 'all' || resourceType === 'note',
  });

  const { data: videos, isLoading: loadingVideos } = useQuery({
    queryKey: ['res-videos', selectedBranchId, selectedSemesterId, searchQuery],
    queryFn: () =>
      getVideos({
        branchId: selectedBranchId || undefined,
        semesterId: selectedSemesterId || undefined,
        search: searchQuery || undefined,
        limit: 12,
      }),
    enabled: resourceType === 'all' || resourceType === 'video',
  });

  const { data: projects, isLoading: loadingProjects } = useQuery({
    queryKey: ['res-projects', selectedBranchId, searchQuery],
    queryFn: () =>
      getProjects({
        branchId: selectedBranchId || undefined,
        search: searchQuery || undefined,
        limit: 12,
      }),
    enabled: resourceType === 'all' || resourceType === 'project',
  });

  return (
    <div className="min-h-screen py-10 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Engineering Resource Vault
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-3xl">
            Search, filter, download, and bookmark high-yield study materials across all engineering branches and semesters.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <Input
                type="text"
                placeholder="Search resources by title, topic, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Branch Filter */}
            <div>
              <select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Branches</option>
                {branches?.map((b: any) => (
                  <option key={b._id} value={b._id}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Semester Filter */}
            <div>
              <select
                value={selectedSemesterId}
                onChange={(e) => setSelectedSemesterId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Resource Type Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold pt-2 border-t border-slate-100 dark:border-slate-800">
            {[
              { id: 'all', label: 'All Resources', icon: Search },
              { id: 'pyq', label: 'PYQ Exam Papers', icon: FileText },
              { id: 'note', label: 'Revision Notes', icon: BookOpen },
              { id: 'video', label: 'Video Lectures', icon: Video },
              { id: 'project', label: 'Projects', icon: FolderGit2 },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setResourceType(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors shrink-0 cursor-pointer ${
                    resourceType === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="space-y-12">
          {/* 1. PYQs Section */}
          {(resourceType === 'all' || resourceType === 'pyq') && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-500" /> Solved University Exam Papers (PYQs)
                </h2>
                <Link href="/pyqs" className="text-xs font-semibold text-blue-600 hover:underline">
                  View All PYQs →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pyqs?.items?.map((item: any) => {
                  const saved = isBookmarked(item._id);
                  return (
                    <div
                      key={item._id}
                      className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500/80 transition-all group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="accent" size="sm">
                            {item.year} Exam Paper
                          </Badge>
                          <button
                            onClick={() =>
                              toggleBookmark({
                                id: item._id,
                                type: 'pyq',
                                title: item.title,
                                slug: item.slug,
                                url: `/pyqs/${item.slug}`,
                                subtitle: item.examType,
                                badge: `${item.year} Paper`,
                              })
                            }
                            className={`p-1.5 rounded-lg transition-colors ${
                              saved
                                ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/60'
                                : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <Bookmark className={`w-4 h-4 ${saved ? 'fill-blue-600' : ''}`} />
                          </button>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-amber-500 transition-colors line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">{item.examType}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-xs text-slate-400">{item.downloadCount} downloads</span>
                        <Link href={`/pyqs/${item.slug}`}>
                          <Button size="sm" variant="outline" className="text-xs font-semibold">
                            View PDF
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Notes Section */}
          {(resourceType === 'all' || resourceType === 'note') && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500" /> Handwritten & Faculty Notes
                </h2>
                <Link href="/notes" className="text-xs font-semibold text-blue-600 hover:underline">
                  View All Notes →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {notes?.items?.map((item: any) => {
                  const saved = isBookmarked(item._id);
                  return (
                    <div
                      key={item._id}
                      className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/80 transition-all group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={item.isHandwritten ? 'accent' : 'primary'} size="sm">
                            {item.isHandwritten ? 'Handwritten' : 'Master Note'}
                          </Badge>
                          <button
                            onClick={() =>
                              toggleBookmark({
                                id: item._id,
                                type: 'note',
                                title: item.title,
                                slug: item.slug,
                                url: `/notes/${item.slug}`,
                                subtitle: item.authorName,
                                badge: item.isHandwritten ? 'Handwritten' : 'PDF Note',
                              })
                            }
                            className={`p-1.5 rounded-lg transition-colors ${
                              saved
                                ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/60'
                                : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <Bookmark className={`w-4 h-4 ${saved ? 'fill-blue-600' : ''}`} />
                          </button>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">{item.authorName || 'Faculty Note'}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-xs text-slate-400">{item.pageCount || 24} pages</span>
                        <Link href={`/notes/${item.slug}`}>
                          <Button size="sm" variant="outline" className="text-xs font-semibold">
                            Read Note
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
