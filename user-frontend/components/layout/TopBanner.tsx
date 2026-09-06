'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, X } from 'lucide-react';
import { useState } from 'react';

export function TopBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 text-white text-xs md:text-sm py-2 px-4 shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 mx-auto truncate">
          <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full text-[11px] uppercase tracking-wider shrink-0">
            <Sparkles className="w-3 h-3 fill-slate-950" /> Offline Batches 2026
          </span>
          <span className="truncate font-medium">
            Classroom Admissions Open in Pune! Up to 50% Merit Scholarships Available.
          </span>
          <Link
            href="/courses"
            className="inline-flex items-center gap-1 underline font-semibold hover:text-amber-200 transition-colors ml-1 shrink-0"
          >
            Book Free Demo <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white/80 hover:text-white p-1 rounded transition-colors shrink-0"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
