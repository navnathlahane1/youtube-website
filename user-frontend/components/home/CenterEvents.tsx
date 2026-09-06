'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Calendar, MapPin, Sparkles, ArrowRight, Users, CheckCircle2 } from 'lucide-react';
import { getEvents } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function CenterEvents() {
  const { data: events, isLoading } = useQuery({
    queryKey: ['center-events'],
    queryFn: () => getEvents(true),
  });

  if (!events || events.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Campus Workshops & Hackathons
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Offline Center Events & Open Houses
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-2xl">
              Participate in hands-on weekend masterclasses, live coding bootcamps, and national hackathons hosted at our campus.
            </p>
          </div>
          <Link href="/events" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline shrink-0">
            View All Events <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((ev: any) => (
            <div
              key={ev._id}
              className="flex flex-col justify-between p-7 rounded-3xl bg-slate-50/60 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-cyan-500/80 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <Badge variant="secondary" size="sm" className="font-bold">
                    {ev.eventType}
                  </Badge>
                  <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(ev.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 transition-colors">
                  {ev.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {ev.summary || ev.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                    <span>{ev.venueOrLink}</span>
                  </div>
                  {ev.speakerName && (
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-cyan-500" />
                      <span>Speaker: {ev.speakerName}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {ev.registeredCount} Students Registered
                </span>
                <Link href={`/events/${ev.slug}`}>
                  <Button size="sm" variant="secondary" className="font-bold">
                    Register Free Seat →
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
