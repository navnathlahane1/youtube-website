'use client';

import React, { useState } from 'react';
import { COMPARISON_TABLE_DATA, ComparisonRow } from '@/lib/career-counselling-data';
import { CheckCircle2, XCircle, AlertCircle, Sparkles, ShieldCheck, ArrowRight, Layers, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function ComparisonTable({ onBookClick }: { onBookClick?: () => void }) {
  const [activeTab, setActiveTab] = useState<'all' | 'mentorship' | 'career-tools' | 'placements'>('all');

  const filteredData = COMPARISON_TABLE_DATA.filter((row) => {
    if (activeTab === 'mentorship') {
      return (
        row.feature.includes('1-on-1') ||
        row.feature.includes('WhatsApp') ||
        row.feature.includes('Follow-up') ||
        row.feature.includes('Working Professional') ||
        row.feature.includes('GATE')
      );
    }
    if (activeTab === 'career-tools') {
      return (
        row.feature.includes('AI Career') ||
        row.feature.includes('College & Specialization') ||
        row.feature.includes('Database') ||
        row.feature.includes('Roadmap') ||
        row.feature.includes('Skill Gap')
      );
    }
    if (activeTab === 'placements') {
      return (
        row.feature.includes('Placement') ||
        row.feature.includes('Internship') ||
        row.feature.includes('Resume') ||
        row.feature.includes('Mock Interview')
      );
    }
    return true;
  });

  return (
    <section id="comparison" className="py-16 md:py-24 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-purple-500/5 dark:bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <Badge variant="primary" className="bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-600 dark:text-purple-400" /> Transparent Feature Comparison
          </Badge>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            Free vs Paid Career Counselling —{' '}
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              What You Actually Get
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            See how Apex Engineering Academy provides comprehensive, Ex-IITian 1-on-1 mentorship, AI roadmap tools, and placement support at zero cost compared to expensive ed-tech platforms and generic schemes.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Features ({COMPARISON_TABLE_DATA.length})
            </button>
            <button
              onClick={() => setActiveTab('mentorship')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'mentorship'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              1-on-1 Mentorship
            </button>
            <button
              onClick={() => setActiveTab('career-tools')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'career-tools'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              AI Tools & Roadmaps
            </button>
            <button
              onClick={() => setActiveTab('placements')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'placements'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Placements & Interviews
            </button>
          </div>
        </div>

        {/* Comparison Table Container */}
        <div className="rounded-3xl border border-purple-200/80 dark:border-purple-900/40 bg-white dark:bg-slate-900/90 shadow-xl overflow-hidden backdrop-blur-sm">
          {/* Scroll instruction for mobile */}
          <div className="lg:hidden px-4 py-2 bg-purple-50/70 dark:bg-purple-950/40 text-[11px] font-medium text-purple-700 dark:text-purple-300 flex items-center justify-between border-b border-purple-100 dark:border-purple-900/40">
            <span>← Swipe horizontally to compare all platforms →</span>
            <span className="font-bold">4 Columns</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[720px]">
              {/* Lavender / Purple Header */}
              <thead>
                <tr className="bg-gradient-to-r from-purple-100/90 via-purple-50/90 to-indigo-100/90 dark:from-purple-950/90 dark:via-slate-900 dark:to-indigo-950/90 border-b border-purple-200 dark:border-purple-900/60 text-slate-900 dark:text-slate-100">
                  <th scope="col" className="py-5 px-6 font-bold text-xs md:text-sm uppercase tracking-wider text-slate-600 dark:text-slate-400 w-2/5">
                    Feature & Offering
                  </th>
                  <th scope="col" className="py-5 px-6 w-1/4 bg-purple-200/40 dark:bg-purple-900/30 border-x border-purple-200 dark:border-purple-800/60">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm md:text-base font-extrabold text-purple-800 dark:text-purple-300">
                          Apex Engineering Academy
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-purple-600 text-white">
                          Official
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-purple-600/90 dark:text-purple-400 mt-0.5">
                        100% Free & Open Guidance
                      </span>
                    </div>
                  </th>
                  <th scope="col" className="py-5 px-6 font-bold text-xs md:text-sm uppercase tracking-wider text-slate-700 dark:text-slate-300 w-1/5">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">Paid EdTech Platforms</span>
                      <span className="text-[11px] font-medium text-rose-500 dark:text-rose-400 mt-0.5">₹15k – ₹50k+ Packages</span>
                    </div>
                  </th>
                  <th scope="col" className="py-5 px-6 font-bold text-xs md:text-sm uppercase tracking-wider text-slate-700 dark:text-slate-300 w-1/5">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">Government Schemes</span>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">State & Central Portals</span>
                    </div>
                  </th>
                </tr>
              </thead>

              {/* Table Rows */}
              <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/80 text-xs sm:text-sm">
                {filteredData.map((row, idx) => (
                  <tr
                    key={row.feature}
                    className={`transition-colors hover:bg-purple-50/40 dark:hover:bg-purple-950/20 ${
                      idx % 2 === 0 ? 'bg-white dark:bg-slate-900/50' : 'bg-slate-50/50 dark:bg-slate-800/20'
                    }`}
                  >
                    {/* Feature Column */}
                    <td className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-100 flex items-start gap-2">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 block">{row.feature}</span>
                        {row.tooltip && (
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-snug">
                            {row.tooltip}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Apex Engineering Column (Highlight) */}
                    <td className="py-4 px-6 bg-purple-50/30 dark:bg-purple-950/20 border-x border-purple-200/60 dark:border-purple-800/40 font-bold">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4 fill-emerald-500/20" />
                        </div>
                        <span className="text-emerald-700 dark:text-emerald-300 font-extrabold">
                          {row.apexValue}
                        </span>
                      </div>
                    </td>

                    {/* Paid Platforms Column */}
                    <td className="py-4 px-6 text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        {row.paidStatus === 'expensive' || row.paidStatus === 'paid' ? (
                          <div className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                            <span className="text-xs font-black">₹</span>
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <AlertCircle className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <span className="text-rose-700 dark:text-rose-300 font-medium">
                          {row.paidValue}
                        </span>
                      </div>
                    </td>

                    {/* Government Schemes Column */}
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        {row.govtStatus === 'not-available' ? (
                          <div className="w-5 h-5 rounded-full bg-slate-500/10 text-slate-400 flex items-center justify-center shrink-0">
                            <XCircle className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                            <AlertCircle className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <span className="text-slate-600 dark:text-slate-400 font-normal">
                          {row.govtValue}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Table Summary Banner */}
          <div className="p-6 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" /> 100% Free Guarantee
              </div>
              <p className="text-sm font-semibold text-slate-100">
                Zero hidden charges. No mandatory course purchases. Real academic guidance.
              </p>
            </div>

            <Button
              onClick={onBookClick}
              variant="accent"
              size="md"
              className="font-bold shadow-lg shadow-amber-500/25 shrink-0"
            >
              Book Free Counselling Session <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
