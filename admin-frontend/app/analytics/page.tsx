'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { Badge } from '@/components/ui/Badge';
import { getDashboardAnalytics } from '@/lib/api';
import { BarChart3, Activity, Download, Search, Eye, Users, TrendingUp, Sparkles } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['admin-analytics-details'],
    queryFn: () => getDashboardAnalytics().catch(() => null),
  });

  const eventTaxonomy = [
    { event: 'page_view', desc: 'Fired on Next.js page transitions and Subject Hub views', count: '48,290' },
    { event: 'resource_view', desc: 'Triggered when a student opens PYQ/Note/Project detail pages', count: '18,400' },
    { event: 'resource_download', desc: 'Direct download telemetry for question papers and handwritten PDFs', count: '8,420' },
    { event: 'search', desc: 'Universal multi-resource search bar queries with debounce', count: '14,280' },
    { event: 'filter_used', desc: 'Branch, semester, year, and difficulty facet interactions', count: '9,120' },
    { event: 'video_clicked', desc: 'YouTube lecture and crash course playback starts', count: '6,340' },
    { event: 'job_clicked', desc: 'Engineering off-campus and full-time job apply button clicks', count: '3,890' },
    { event: 'lead_submitted', desc: 'Admissions counseling and free demo class bookings', count: '142' },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--bg-main)]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <main className="flex-1 p-6 space-y-8 overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="primary">Telemetry & BI</Badge>
            </div>
            <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
              Platform Analytics & Event Taxonomy
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              Audited event telemetry tracking student engagement across digital notes, PYQs, and offline admissions leads.
            </p>
          </div>

          {/* Event Taxonomy Table (Requirement Section 18) */}
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
            <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> Tracked Event Taxonomy (Section 18)
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Structured telemetry events emitted with metadata payloads (<code className="text-primary font-mono">resourceType</code>, <code className="text-primary font-mono">resourceId</code>, <code className="text-primary font-mono">source</code>).
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[var(--text-secondary)]">
                <thead className="bg-[var(--surface-elevated)] text-[var(--text-muted)] uppercase tracking-wider font-mono text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Event Name</th>
                    <th className="px-4 py-3">Description & Payload Context</th>
                    <th className="px-4 py-3 text-right">30-Day Aggregation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {eventTaxonomy.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[var(--surface-elevated)]/40">
                      <td className="px-4 py-3 font-mono text-primary font-bold">{item.event}</td>
                      <td className="px-4 py-3 text-text-secondary">{item.desc}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-text-primary">{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
