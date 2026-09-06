import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Users, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function UpcomingBatches() {
  const batches = [
    {
      course: 'Semester 5 Computer & IT Classroom Mastery',
      batchName: 'Weekday Regular Morning Batch',
      startDate: 'Starts Next Monday (Sept 15)',
      timing: '7:30 AM - 10:00 AM (Mon - Fri)',
      location: 'Apex Learning Center, Room 101, Pune',
      seatsTotal: 35,
      seatsAvailable: 8,
      mode: 'Offline Classroom',
    },
    {
      course: 'GATE 2026 Comprehensive Computer Science Track',
      batchName: 'Weekend Intensive Super-Batch',
      startDate: 'Starts This Saturday (Sept 13)',
      timing: '8:30 AM - 4:00 PM (Sat & Sun)',
      location: 'Apex Learning Center, Floor 2 Auditorium',
      seatsTotal: 45,
      seatsAvailable: 11,
      mode: 'Offline Classroom + CBT Access',
    },
    {
      course: 'Full Stack & Cloud Placement Accelerator',
      batchName: 'Evening Placement Track',
      startDate: 'Starts Sept 20',
      timing: '6:00 PM - 8:30 PM (Tue, Thu, Sat)',
      location: 'Apex Innovation Maker Lab',
      seatsTotal: 30,
      seatsAvailable: 5,
      mode: 'Hybrid Lab Track',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full mb-3">
              <Calendar className="w-3.5 h-3.5" /> Admissions Desk
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Upcoming Offline Batch Schedules & Timings
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-2xl">
              Limited seats per batch to guarantee personal faculty doubt clearance. Reserve your seat with a free demo pass.
            </p>
          </div>
          <Link href="/contact" className="shrink-0">
            <Button variant="accent" className="font-bold shadow-md shadow-amber-500/20">
              Reserve Free Demo Seat <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {batches.map((b, i) => (
            <div
              key={i}
              className="flex flex-col lg:flex-row lg:items-center justify-between p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-lg hover:border-blue-500/60 transition-all gap-6"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                    {b.mode}
                  </span>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{b.startDate}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{b.course}</h3>
                <p className="text-xs text-slate-500 font-semibold">{b.batchName}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-500" /> {b.timing}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" /> {b.location}
                  </span>
                </div>
              </div>

              <div className="flex sm:items-center justify-between lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                <div className="text-left lg:text-right">
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-xs border border-amber-200 dark:border-amber-800/60">
                    <Users className="w-3.5 h-3.5" /> Only {b.seatsAvailable} Seats Left
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Batch Cap: {b.seatsTotal} Students</p>
                </div>
                <Link href="/contact" className="shrink-0">
                  <Button size="sm" variant="accent" className="font-bold">
                    Enroll / Free Demo
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
