import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { FileText, Download, CheckCircle2, ChevronLeft, Bookmark, Sparkles, BookOpen, Share2 } from 'lucide-react';
import { getPYQBySlug } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pyq = await getPYQBySlug(slug).catch(() => null);
  if (!pyq) return { title: 'PYQ Paper' };

  return {
    title: `${pyq.title} | Solved University Paper`,
    description: pyq.description || `Download solved university question paper for ${pyq.title}.`,
  };
}

export default async function PYQDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pyq = await getPYQBySlug(slug).catch(() => null);

  if (!pyq) {
    notFound();
  }

  return (
    <div className="min-h-screen py-10 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/pyqs" className="hover:text-blue-600 flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" /> All PYQs
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{pyq.subjectId?.name}</span>
          <span>/</span>
          <span className="font-semibold text-amber-500">{pyq.year} Exam</span>
        </div>

        {/* Paper Details Card */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="accent" size="md">
                  {pyq.year} University Examination
                </Badge>
                <Badge variant="primary" size="md">
                  {pyq.subjectId?.code || 'Engineering'}
                </Badge>
                <Badge variant="outline" size="md">
                  {pyq.difficulty}
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                {pyq.title}
              </h1>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                {pyq.description || 'Complete official university examination paper with step-by-step model solutions and marks distribution.'}
              </p>
            </div>

            {/* Download Stats */}
            <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
              <div className="text-xs text-slate-500">
                <strong className="text-slate-900 dark:text-slate-100">{pyq.downloadCount}</strong> students downloaded
              </div>
              <div className="text-xs text-slate-500">
                <strong className="text-slate-900 dark:text-slate-100">{pyq.viewCount}</strong> views
              </div>
            </div>
          </div>

          {/* Tags */}
          {pyq.tags && pyq.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {pyq.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons: Question Paper & Solution PDF */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="font-bold text-sm text-slate-900 dark:text-slate-100">Official Question & Solution Papers</div>
              <p className="text-xs text-slate-500">Verified by Apex Engineering Academy Faculty Panel.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a href={pyq.questionPaperUrl} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm" className="font-semibold">
                  <Download className="w-4 h-4 mr-1.5" /> Question Paper PDF
                </Button>
              </a>

              {pyq.solutionPaperUrl && (
                <a href={pyq.solutionPaperUrl} target="_blank" rel="noreferrer">
                  <Button variant="accent" size="sm" className="font-bold shadow-md shadow-amber-500/20">
                    <Download className="w-4 h-4 mr-1.5" /> Solved Solution PDF
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Classroom Coaching CTA */}
        <div className="p-7 rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-center md:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Score 9+ Pointer in Your Semesters
            </div>
            <h3 className="text-xl font-bold">Join Our Offline Classroom Coaching in Pune</h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Get printed 10-year question banks, formula booklets, and daily 1-on-1 personal doubt solving cabins.
            </p>
          </div>
          <Link href="/contact" className="shrink-0">
            <Button variant="accent" size="md" className="font-bold shadow-lg">
              Book Free Demo Class →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
