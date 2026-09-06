import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Video, Clock, ChevronLeft, Sparkles, BookOpen, Share2, Play } from 'lucide-react';
import { getVideoBySlug } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideoBySlug(slug).catch(() => null);
  if (!video) return { title: 'Video Lecture' };

  return {
    title: `${video.title} | Engineering Video Tutorial`,
    description: video.description || `Watch tutorial lecture for ${video.title}.`,
  };
}

export default async function VideoDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug).catch(() => null);

  if (!video) {
    notFound();
  }

  return (
    <div className="min-h-screen py-10 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/videos" className="hover:text-blue-600 flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" /> All Videos
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{video.subjectId?.name}</span>
          <span>/</span>
          <span className="font-semibold text-rose-500 truncate">{video.title}</span>
        </div>

        {/* Video Player Container */}
        <div className="rounded-3xl overflow-hidden bg-black border border-slate-800 shadow-2xl mb-8 aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=0&rel=0`}
            title={video.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Video Metadata Card */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="danger" size="md">
                  Video Tutorial
                </Badge>
                {video.unitNumber && <Badge variant="primary" size="md">Unit {video.unitNumber}</Badge>}
                <span className="text-xs font-semibold text-slate-500">
                  {video.subjectId?.name} ({video.subjectId?.code})
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                {video.title}
              </h1>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                {video.description}
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0 text-xs text-slate-500">
              <div>Instructor: <strong className="text-slate-900 dark:text-slate-100">{video.instructorName || 'Apex Faculty'}</strong></div>
              <div>Duration: <strong className="text-slate-900 dark:text-slate-100">{Math.floor((video.durationSeconds || 1200) / 60)} Minutes</strong></div>
              <div>Views: <strong className="text-slate-900 dark:text-slate-100">{video.viewCount}</strong></div>
            </div>
          </div>

          {/* Timestamps Index */}
          {video.timestamps && video.timestamps.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-500" /> Lecture Timestamps & Topic Index
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {video.timestamps.map((ts: any, idx: number) => {
                  const minutes = Math.floor(ts.seconds / 60);
                  const seconds = ts.seconds % 60;
                  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                    >
                      <span className="font-mono font-bold text-rose-500 shrink-0 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded">
                        {timeFormatted}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium truncate">{ts.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Offline Center Coaching CTA */}
        <div className="p-7 rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-center md:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Learn Directly with the Faculty in Pune
            </div>
            <h3 className="text-xl font-bold">Personal Doubt Solving & Classroom Tuition</h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Meet {video.instructorName || 'our professors'} in person at our Tech Park learning center. Book a free demo class.
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
