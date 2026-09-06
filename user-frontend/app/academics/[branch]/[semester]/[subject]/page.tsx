import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  BookOpen,
  FileText,
  Video,
  Download,
  CheckCircle2,
  Bookmark,
  Sparkles,
  ChevronLeft,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';
import { getSubjectHub } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ branch: string; semester: string; subject: string }>;
}): Promise<Metadata> {
  const { subject: subjectSlug } = await params;
  const hubData = await getSubjectHub(subjectSlug).catch(() => null);
  const sub = hubData?.subject;

  if (!sub) {
    return { title: 'Subject Hub' };
  }

  return {
    title: `${sub.name} (${sub.code}) Notes, PYQs & Syllabus Breakdown`,
    description: `Complete university syllabus, unit breakdown, solved previous year question papers, formula sheets, and video tutorials for ${sub.name}.`,
  };
}

export default async function SubjectHubPage({
  params,
}: {
  params: Promise<{ branch: string; semester: string; subject: string }>;
}) {
  const { branch: branchSlug, semester: semesterNumStr, subject: subjectSlug } = await params;
  const semesterNum = parseInt(semesterNumStr, 10) || 1;

  const hubData = await getSubjectHub(subjectSlug).catch(() => null);

  if (!hubData || !hubData.subject) {
    notFound();
  }

  const { subject, resources } = hubData;

  return (
    <div className="min-h-screen py-10 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 overflow-x-auto">
          <Link href="/academics" className="hover:text-blue-600">
            Academics
          </Link>
          <span>/</span>
          <Link href={`/academics/${branchSlug}/${semesterNum}`} className="hover:text-blue-600 uppercase">
            {branchSlug} Sem {semesterNum}
          </Link>
          <span>/</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400 truncate">{subject.name}</span>
        </div>

        {/* Subject Header Banner */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-10">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary" size="md">
                  {subject.code}
                </Badge>
                <Badge variant="secondary" size="md">
                  {subject.credits} Credits
                </Badge>
                <span className="text-xs font-semibold text-slate-500">
                  Semester {semesterNum} • {subject.branchId?.name || 'Engineering'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                {subject.name}
              </h1>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {subject.syllabusOverview || subject.description}
              </p>
            </div>

            {/* Offline Batch Inquiry Button */}
            <div className="p-5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 lg:max-w-xs shrink-0 space-y-3">
              <div className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Need Offline Coaching for {subject.code}?
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Join our weekend & weekday regular classroom batches in Pune with 1-on-1 doubt solving.
              </p>
              <Link href="/contact" className="block">
                <Button size="sm" variant="accent" className="w-full font-bold">
                  Book Free Demo Class
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Column: Syllabus Breakdown + Solved PYQs */}
          <div className="lg:col-span-8 space-y-10">
            {/* 1. Unit Breakdown */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" /> Syllabus Unit Breakdown
                </h2>
                <span className="text-xs text-slate-500 font-semibold">{subject.units?.length || 0} Units</span>
              </div>

              <div className="space-y-4">
                {subject.units?.map((unit: any) => (
                  <div
                    key={unit.unitNumber}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                        Unit {unit.unitNumber}
                      </span>
                      {unit.weightagePercentage && (
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                          ~{unit.weightagePercentage}% Exam Weightage
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{unit.title}</h3>
                    {unit.description && <p className="text-xs text-slate-500">{unit.description}</p>}

                    {unit.keyTopics && unit.keyTopics.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                          Key Exam Topics:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {unit.keyTopics.map((topic: string, tIdx: number) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded-md text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Solved PYQs for this Subject */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-500" /> Solved University Exam Papers (PYQs)
                </h2>
                <Link href={`/pyqs?subjectId=${subject._id}`} className="text-xs font-semibold text-blue-600 hover:underline">
                  View All Papers →
                </Link>
              </div>

              {resources.pyqs && resources.pyqs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {resources.pyqs.map((p: any) => (
                    <div
                      key={p._id}
                      className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500/80 transition-all group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="accent" size="sm">
                            {p.year} Exam Paper
                          </Badge>
                          <span className="text-xs text-slate-500">{p.downloadCount} downloads</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-amber-500 transition-colors line-clamp-2">
                          {p.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">{p.examType}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-xs text-emerald-600 font-semibold">✓ Solutions Attached</span>
                        <Link href={`/pyqs/${p.slug}`}>
                          <Button size="sm" variant="outline" className="font-semibold text-xs">
                            View PDF
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-xs text-slate-500">
                  No PYQ papers currently uploaded for this subject.
                </div>
              )}
            </div>

            {/* 3. Notes & Formula Sheets */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-500" /> Revision Notes & Cheatsheets
                </h2>
              </div>

              {resources.notes && resources.notes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {resources.notes.map((n: any) => (
                    <div
                      key={n._id}
                      className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/80 transition-all group"
                    >
                      <div>
                        <Badge variant={n.isHandwritten ? 'accent' : 'success'} size="sm" className="mb-2">
                          {n.isHandwritten ? 'Handwritten' : 'Faculty Master Note'}
                        </Badge>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-500 transition-colors line-clamp-2">
                          {n.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">{n.authorName || 'Faculty Note'}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-xs text-slate-500">{n.pageCount || 20} Pages</span>
                        <Link href={`/notes/${n.slug}`}>
                          <Button size="sm" variant="outline" className="font-semibold text-xs">
                            Read Note
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {/* Sidebar Column: Video Lectures & Recommended Textbooks */}
          <div className="lg:col-span-4 space-y-8">
            {/* Recommended Standard Textbooks */}
            {subject.recommendedBooks && subject.recommendedBooks.length > 0 && (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" /> Recommended Textbooks
                </h3>
                <div className="space-y-3 text-xs">
                  {subject.recommendedBooks.map((bk: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                      <p className="font-bold text-slate-800 dark:text-slate-200">{bk.title}</p>
                      <p className="text-slate-500 mt-0.5">Author: {bk.author}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Lectures */}
            {resources.videos && resources.videos.length > 0 && (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Video className="w-4 h-4 text-rose-500" /> Curated Video Lectures
                </h3>
                <div className="space-y-3">
                  {resources.videos.map((vid: any) => (
                    <Link
                      key={vid._id}
                      href={`/videos/${vid.slug}`}
                      className="block p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors group"
                    >
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-rose-600 line-clamp-2">
                        {vid.title}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                        <span>{vid.instructorName || 'Lecture'}</span>
                        <span className="text-rose-500 font-semibold">Watch →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
