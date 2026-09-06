'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  FileText,
  BookOpen,
  Video,
  FolderGit2,
  Download,
  Eye,
  Bookmark,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { getPYQs, getNotes, getVideos, getProjects } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useBookmarksStore } from '@/lib/store/bookmarks-store';

export function FeaturedResources() {
  const [activeTab, setActiveTab] = useState<'pyqs' | 'notes' | 'videos' | 'projects'>('pyqs');
  const { toggleBookmark, isBookmarked } = useBookmarksStore();

  const { data: pyqData, isLoading: loadingPyqs } = useQuery({
    queryKey: ['featured-pyqs'],
    queryFn: () => getPYQs({ limit: 4 }),
  });

  const { data: noteData, isLoading: loadingNotes } = useQuery({
    queryKey: ['featured-notes'],
    queryFn: () => getNotes({ limit: 4 }),
  });

  const { data: videoData, isLoading: loadingVideos } = useQuery({
    queryKey: ['featured-videos'],
    queryFn: () => getVideos({ limit: 4 }),
  });

  const { data: projectData, isLoading: loadingProjects } = useQuery({
    queryKey: ['featured-projects'],
    queryFn: () => getProjects({ limit: 4 }),
  });

  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full mb-3">
              <BookOpen className="w-3.5 h-3.5" /> High-Yield Digital Vault
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Popular Engineering Resources
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-2xl">
              Download curated university examination papers with step-by-step model solutions, faculty revision formula sheets, and code repositories.
            </p>
          </div>

          {/* Navigation Pill Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start md:self-auto overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTab('pyqs')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors shrink-0 cursor-pointer ${
                activeTab === 'pyqs'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Solved PYQs
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors shrink-0 cursor-pointer ${
                activeTab === 'notes'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Notes & Sheets
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors shrink-0 cursor-pointer ${
                activeTab === 'videos'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Video className="w-3.5 h-3.5" /> Video Lectures
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors shrink-0 cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5" /> Projects
            </button>
          </div>
        </div>

        {/* 1. PYQs Tab Content */}
        {activeTab === 'pyqs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingPyqs
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)
              : pyqData?.items?.map((item: any) => {
                  const saved = isBookmarked(item._id);
                  return (
                    <div
                      key={item._id}
                      className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-blue-500/80 transition-all group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <Badge variant="primary" size="sm">
                            {item.year} Exam
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
                            title={saved ? 'Remove Bookmark' : 'Save Resource'}
                          >
                            <Bookmark className={`w-4 h-4 ${saved ? 'fill-blue-600' : ''}`} />
                          </button>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">{item.examType}</p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" /> {item.downloadCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {item.viewCount}
                          </span>
                        </div>
                        <Link
                          href={`/pyqs/${item.slug}`}
                          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          View PDF <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
          </div>
        )}

        {/* 2. Notes Tab Content */}
        {activeTab === 'notes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingNotes
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)
              : noteData?.items?.map((item: any) => {
                  const saved = isBookmarked(item._id);
                  return (
                    <div
                      key={item._id}
                      className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-emerald-500/80 transition-all group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <Badge variant={item.isHandwritten ? 'accent' : 'success'} size="sm">
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
                                ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60'
                                : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <Bookmark className={`w-4 h-4 ${saved ? 'fill-emerald-600' : ''}`} />
                          </button>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">{item.authorName || 'Faculty Note'}</p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          <span>{item.pageCount || 20} Pages</span>
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" /> {item.downloadCount}
                          </span>
                        </div>
                        <Link
                          href={`/notes/${item.slug}`}
                          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          Read Note <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
          </div>
        )}

        {/* 3. Videos Tab Content */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingVideos
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)
              : videoData?.items?.map((item: any) => (
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
                          <Video className="w-5 h-5 fill-white" />
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-rose-600 transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">{item.instructorName || 'Lecture Series'}</p>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                        <span className="text-xs text-slate-400">{Math.floor((item.durationSeconds || 1200) / 60)} mins lecture</span>
                        <Link
                          href={`/videos/${item.slug}`}
                          className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                        >
                          Watch Lecture <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        )}

        {/* 4. Projects Tab Content */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingProjects
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)
              : projectData?.items?.map((item: any) => (
                  <div
                    key={item._id}
                    className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-cyan-500 transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <Badge variant="secondary" size="sm">
                          {item.category}
                        </Badge>
                        <Badge variant="outline" size="sm">
                          {item.difficulty}
                        </Badge>
                      </div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                        {item.abstract}
                      </p>

                      {/* Tech stack badges */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {item.techStack?.slice(0, 4).map((tech: string) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <Link
                        href={`/projects/${item.slug}`}
                        className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        Project Docs & Architecture <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/resources">
            <Button size="lg" variant="outline" className="font-semibold">
              Explore All 500+ Engineering Resources →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
