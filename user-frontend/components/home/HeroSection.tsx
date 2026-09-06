'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
  Building,
  GraduationCap,
  Download,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/lib/store/ui-store';

export function HeroSection() {
  const openSearchModal = useUIStore((s) => s.openSearchModal);

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/10 dark:bg-blue-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs md:text-sm font-semibold mb-6 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>Pune&apos;s Premier Offline Engineering Academy & Resource Portal</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.15]">
            Master Your Engineering Degree.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">
              Crack High-Paying Placements.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Experience our elite offline classroom coaching with Ex-IITian faculty in Pune, while unlocking free university PYQs with solutions, toppers handwritten notes, video lectures, and career roadmaps.
          </p>

          {/* Search Trigger Banner */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div
              onClick={openSearchModal}
              className="flex items-center justify-between p-2 pl-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 text-sm">
                <Search className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="text-left font-medium">Search engineering PYQs, notes, videos, roadmaps...</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="hidden sm:inline-flex px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-md border border-slate-200 dark:border-slate-700">
                  Ctrl+K
                </kbd>
                <Button size="sm" className="font-semibold shadow-none">
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Dual Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link href="/contact">
              <Button size="lg" variant="accent" className="font-bold shadow-lg shadow-amber-500/20">
                Book Free Demo Class <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/resources">
              <Button size="lg" variant="outline" className="font-semibold">
                <BookOpen className="w-4 h-4 mr-2" /> Browse Free Resources
              </Button>
            </Link>
          </div>

          {/* Trust Metrics Grid */}
          <div className="mt-14 pt-10 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">15,000+</div>
              <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                Engineers Mentored
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">500+</div>
              <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                Solved PYQs & Notes
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-500">4.96 ★</div>
              <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                Student Satisfaction
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">100%</div>
              <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                Offline Classroom Pass Rate
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
