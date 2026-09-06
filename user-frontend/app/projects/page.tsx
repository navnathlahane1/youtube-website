'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { FolderGit2, Search, ArrowRight, ExternalLink } from 'lucide-react';
import { getProjects, getBranches } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';

export default function ProjectsListingPage() {
  const [search, setSearch] = useState('');
  const [branchId, setBranchId] = useState('');
  const [category, setCategory] = useState('');

  const { data: branches } = useQuery({ queryKey: ['branches'], queryFn: getBranches });

  const { data: projectData, isLoading } = useQuery({
    queryKey: ['projects-page', branchId, category, search],
    queryFn: () =>
      getProjects({
        branchId: branchId || undefined,
        category: category || undefined,
        search: search || undefined,
        limit: 20,
      }),
  });

  return (
    <div className="min-h-screen py-10 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-3 py-1 rounded-full mb-3">
            <FolderGit2 className="w-3.5 h-3.5" /> Capstone & Mini Projects
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Final Year Engineering Project Repositories
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-3xl">
            Browse complete engineering project documentation, source code repositories, 3D CAD models, and circuit schematics.
          </p>
        </div>

        {/* Filters */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-8 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Input
              type="text"
              placeholder="Search by title, tech stack (e.g. React, Python)..."
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
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs sm:text-sm"
            >
              <option value="">All Categories</option>
              <option value="Final Year Major Project (CapStone)">Final Year Major Project</option>
              <option value="Third Year Mini Project">Third Year Mini Project</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)
          ) : projectData?.items?.length > 0 ? (
            projectData.items.map((p: any) => (
              <div
                key={p._id}
                className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-cyan-500 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant="secondary" size="sm">
                      {p.category}
                    </Badge>
                    <Badge variant="outline" size="sm">
                      {p.difficulty}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 transition-colors line-clamp-2">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {p.abstract}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.techStack?.slice(0, 4).map((tech: string) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">{p.downloadCount || 0} downloads</span>
                  <Link href={`/projects/${p.slug}`}>
                    <Button size="sm" variant="outline" className="text-xs font-semibold text-cyan-600">
                      View Project <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              <FolderGit2 className="w-10 h-10 mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No project repositories found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
