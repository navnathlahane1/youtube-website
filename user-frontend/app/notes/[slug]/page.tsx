import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { BookOpen, Download, ChevronLeft, Bookmark, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { getNoteBySlug } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const note = await getNoteBySlug(slug).catch(() => null);
  if (!note) return { title: 'Lecture Notes' };

  return {
    title: `${note.title} | Engineering Notes`,
    description: note.description || `Download free handwritten & faculty notes for ${note.title}.`,
  };
}

export default async function NoteDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = await getNoteBySlug(slug).catch(() => null);

  if (!note) {
    notFound();
  }

  return (
    <div className="min-h-screen py-10 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/notes" className="hover:text-blue-600 flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" /> All Notes
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{note.subjectId?.name}</span>
          <span>/</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">Unit {note.unitNumber || 1}</span>
        </div>

        {/* Note Details Card */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={note.isHandwritten ? 'accent' : 'primary'} size="md">
                  {note.isHandwritten ? 'Handwritten Toppers Note' : 'Faculty Master Note'}
                </Badge>
                {note.unitNumber && <Badge variant="secondary" size="md">Unit {note.unitNumber}</Badge>}
                <span className="text-xs font-semibold text-slate-500">
                  {note.subjectId?.name} ({note.subjectId?.code})
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                {note.title}
              </h1>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                {note.description || 'Comprehensive revision notes with step-by-step mathematical proofs, solved numerical examples, and key university definitions.'}
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0 text-xs text-slate-500">
              <div>Author: <strong className="text-slate-900 dark:text-slate-100">{note.authorName || 'Apex Faculty'}</strong></div>
              <div>Pages: <strong className="text-slate-900 dark:text-slate-100">{note.pageCount || 24} Pages</strong></div>
              <div>Downloads: <strong className="text-slate-900 dark:text-slate-100">{note.downloadCount}</strong></div>
            </div>
          </div>

          {/* Download Action Area */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-slate-100">Download Complete PDF Note</div>
              <p className="text-xs text-slate-500">High-resolution printable document format.</p>
            </div>

            <a href={note.fileUrl} target="_blank" rel="noreferrer">
              <Button size="md" variant="primary" className="font-bold shadow-md shadow-blue-500/20">
                <Download className="w-4 h-4 mr-2" /> Download PDF ({note.pageCount || 24} Pages)
              </Button>
            </a>
          </div>
        </div>

        {/* Offline Center Promo Banner */}
        <div className="p-7 rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-center md:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Study at Apex Offline Learning Center
            </div>
            <h3 className="text-xl font-bold">Printed Formula Booklets & 1-on-1 Faculty Doubt Cabins</h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Visit our center in Pune to collect free printed formula handbooks and attend live demo classes.
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
