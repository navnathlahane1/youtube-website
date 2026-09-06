'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { DataTable } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/Badge';
import { getLeads, updateLead, deleteLead } from '@/lib/api';
import { Phone, Mail, MessageSquare, Trash2, Edit2, Sparkles, CheckCircle2, Clock, UserCheck } from 'lucide-react';

export default function AdminLeadsPage() {
  const queryClient = useQueryClient();
  const [editingLead, setEditingLead] = useState<any>(null);
  const [counselorNotes, setCounselorNotes] = useState('');

  const { data: leadsRes, isLoading } = useQuery({
    queryKey: ['admin-leads'],
    queryFn: () => getLeads({ limit: 100 }).catch(() => ({ items: [] })),
  });

  const leads = leadsRes?.items || [];

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
      setEditingLead(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
    },
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'status',
      header: 'Pipeline Stage',
      cell: ({ row }) => {
        const s = row.original.status || 'NEW';
        return (
          <select
            value={s}
            onChange={(e) => updateMutation.mutate({ id: row.original._id, data: { status: e.target.value } })}
            className={`text-xs px-2 py-1 rounded-lg font-bold border ${
              s === 'NEW'
                ? 'bg-primary-light text-primary border-primary/20'
                : s === 'ENROLLED'
                ? 'bg-success-light text-success border-success/20'
                : s === 'DEMO_ATTENDED'
                ? 'bg-accent-light text-accent border-accent/20'
                : 'bg-warning-light text-warning border-warning/20'
            }`}
          >
            <option value="NEW">NEW LEAD</option>
            <option value="CONTACTED">CONTACTED</option>
            <option value="COUNSELING_SCHEDULED">COUNSELING BOOKED</option>
            <option value="DEMO_ATTENDED">DEMO ATTENDED</option>
            <option value="ENROLLED">ENROLLED (PAID)</option>
            <option value="CLOSED">CLOSED</option>
            <option value="JUNK">JUNK</option>
          </select>
        );
      },
    },
    {
      accessorKey: 'fullName',
      header: 'Student & Contact',
      cell: ({ row }) => (
        <div>
          <span className="font-bold text-[var(--text-primary)]">{row.original.fullName}</span>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mt-0.5">
            <a href={`tel:${row.original.phone}`} className="text-primary hover:underline flex items-center gap-1">
              <Phone className="w-3 h-3" /> {row.original.phone}
            </a>
            {row.original.email && (
              <>
                <span>•</span>
                <span className="truncate max-w-[140px]">{row.original.email}</span>
              </>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'collegeName',
      header: 'College & Branch',
      cell: ({ row }) => (
        <div>
          <span className="font-semibold text-xs text-[var(--text-secondary)]">
            {row.original.collegeName || 'Engineering Student'}
          </span>
          <span className="text-[11px] text-[var(--text-muted)] block">
            {row.original.branchName || 'General'} {row.original.currentSemester ? `• Sem ${row.original.currentSemester}` : ''}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'inquiryType',
      header: 'Inquiry Source',
      cell: ({ row }) => (
        <Badge variant="neutral" size="sm">
          {row.original.inquiryType?.replace('_', ' ') || 'GENERAL'}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Submitted',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-[var(--text-muted)]">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setEditingLead(row.original);
              setCounselorNotes(row.original.notes || '');
            }}
            title="Counselor Notes"
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--surface-elevated)] transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete lead ${row.original.fullName}?`)) {
                deleteMutation.mutate(row.original._id);
              }
            }}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-danger-light transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--bg-main)]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="primary">Admissions CRM</Badge>
              </div>
              <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
                Student Inquiries & Demo Class Pipeline
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                Track counselor callbacks, demo attendance, and classroom batch conversions.
              </p>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={leads}
            isLoading={isLoading}
            searchPlaceholder="Search student leads by name, college, phone..."
            onBulkDelete={(rows) => rows.forEach((r) => deleteMutation.mutate(r._id))}
          />

          {/* Counselor Notes Modal */}
          {editingLead && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 space-y-4 shadow-2xl">
                <div>
                  <h3 className="font-bold text-sm text-[var(--text-primary)]">
                    Counselor Notes: {editingLead.fullName}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">{editingLead.phone} • {editingLead.collegeName}</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">
                    Internal Follow-up Log
                  </label>
                  <textarea
                    rows={4}
                    value={counselorNotes}
                    onChange={(e) => setCounselorNotes(e.target.value)}
                    placeholder="e.g. Called student on Sep 6. Interested in 5th sem DBMS & CN classroom batch. Attending demo on Monday..."
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingLead(null)}
                    className="px-4 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] text-[var(--text-secondary)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateMutation.mutate({
                        id: editingLead._id,
                        data: { notes: counselorNotes },
                      });
                    }}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
