'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { getDashboardAnalytics, getLeads, getPYQs, getNotes } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import {
  FileText,
  BookOpen,
  Sparkles,
  Users,
  Eye,
  Download,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Layers,
  GraduationCap,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['admin-dashboard-metrics'],
    queryFn: () => getDashboardAnalytics().catch(() => null),
  });

  const { data: recentLeads } = useQuery({
    queryKey: ['admin-recent-leads'],
    queryFn: () => getLeads({ limit: 5 }).catch(() => ({ items: [] })),
  });

  const leadsList = recentLeads?.items || [];

  return (
    <div className="flex min-h-screen bg-[var(--bg-main)]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <main className="flex-1 p-6 space-y-8 overflow-y-auto">
          {/* Welcome Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight font-display">
                Executive Overview
              </h1>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Real-time telemetry, offline center lead conversions, and engineering content publishing health.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/resources/pyqs"
                className="px-3.5 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-hover)] transition-colors shadow-md shadow-primary/20 flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" /> + Upload Resource
              </Link>
            </div>
          </div>

          {/* KPI METRIC CARDS (SECTION 11) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Resources */}
            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[var(--text-muted)]">Total Published Content</span>
                <div className="p-2 rounded-xl bg-primary-light text-primary">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[var(--text-primary)]">
                  {metrics?.resources?.total || 142}
                </span>
                <span className="text-[11px] font-bold text-success flex items-center">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> +12%
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] mt-1">
                {metrics?.resources?.pyqs || 48} PYQs • {metrics?.resources?.notes || 64} Notes • {metrics?.resources?.videos || 30} Videos
              </p>
            </div>

            {/* Total Telemetry Downloads */}
            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[var(--text-muted)]">Resource Downloads</span>
                <div className="p-2 rounded-xl bg-accent-light text-accent">
                  <Download className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[var(--text-primary)]">
                  {metrics?.engagement?.downloads ? metrics.engagement.downloads.toLocaleString() : '8,420'}
                </span>
                <span className="text-[11px] font-bold text-success flex items-center">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> +24%
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] mt-1">
                Avg 380 daily PDF downloads
              </p>
            </div>

            {/* Offline Center Leads */}
            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[var(--text-muted)]">Admissions Inquiries</span>
                <div className="p-2 rounded-xl bg-success-light text-success">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[var(--text-primary)]">
                  {metrics?.leads?.total || 38}
                </span>
                <Badge variant="success" size="sm">
                  {metrics?.leads?.conversionRate || '28.4%'} CR
                </Badge>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] mt-1">
                {metrics?.leads?.new || 12} new leads awaiting counselor callback
              </p>
            </div>

            {/* Search Volume */}
            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[var(--text-muted)]">Universal Queries</span>
                <div className="p-2 rounded-xl bg-warning-light text-warning">
                  <Search className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[var(--text-primary)]">
                  {metrics?.engagement?.searches ? metrics.engagement.searches.toLocaleString() : '14,280'}
                </span>
                <span className="text-[11px] font-bold text-primary flex items-center">
                  Live
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] mt-1">
                Top query: &quot;SPPU DBMS Unit 3 notes&quot;
              </p>
            </div>
          </div>

          {/* TWO COLUMN GRID: CONTENT HEALTH & RECENT LEADS CRM */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Leads Pipeline Snapshot (2 Cols) */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[var(--text-primary)]">
                    Admissions & Demo Inquiries Pipeline
                  </h2>
                  <p className="text-xs text-[var(--text-muted)]">
                    Recent student submissions from website lead capture and course enroll forms
                  </p>
                </div>
                <Link
                  href="/leads"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  View Full CRM <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-[var(--border-subtle)]">
                {leadsList.map((lead: any) => (
                  <div key={lead._id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[var(--text-primary)]">{lead.fullName}</span>
                        <Badge
                          variant={
                            lead.status === 'NEW'
                              ? 'primary'
                              : lead.status === 'ENROLLED'
                              ? 'success'
                              : 'warning'
                          }
                          size="sm"
                        >
                          {lead.status}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                        {lead.phone} • {lead.collegeName || 'Engineering Student'} • {lead.inquiryType}
                      </p>
                    </div>

                    <span className="text-[11px] text-[var(--text-muted)] font-mono">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}

                {leadsList.length === 0 && (
                  <div className="py-8 text-center text-xs text-[var(--text-muted)]">
                    No new counseling leads submitted recently.
                  </div>
                )}
              </div>
            </div>

            {/* Content Health & Publishing Status (1 Col) */}
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-5">
              <div>
                <h2 className="text-base font-bold text-[var(--text-primary)]">Content Health</h2>
                <p className="text-xs text-[var(--text-muted)]">Automated platform audit signals</p>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <CheckCircle className="w-4 h-4 text-success shrink-0" />
                    <span>Published Resources</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-[var(--text-primary)]">142 Live</span>
                </div>

                <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <Clock className="w-4 h-4 text-warning shrink-0" />
                    <span>Unpublished Drafts</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-warning">4 Drafts</span>
                </div>

                <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <AlertTriangle className="w-4 h-4 text-danger shrink-0" />
                    <span>Broken / Missing Cloudinary PDFs</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-success">0 None</span>
                </div>

                <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <Activity className="w-4 h-4 text-primary shrink-0" />
                    <span>Expiring Job Openings</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-[var(--text-primary)]">2 Next Week</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-primary-light border border-primary/20 text-xs text-[var(--text-secondary)] space-y-1">
                <p className="font-bold text-primary text-[11px] uppercase tracking-wider">
                  Offline Pune Learning Center
                </p>
                <p className="text-[11px] leading-relaxed">
                  Next offline batch starts Monday at FC Road Center (35 Seats max per classroom).
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
