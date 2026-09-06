'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { DataTable } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/Badge';
import { ResourceFormModal } from '@/components/forms/ResourceFormModal';
import { getPYQs, createPYQ, updatePYQ, deletePYQ, updatePYQStatus } from '@/lib/api';
import { Plus, Trash2, Edit2, Download, Eye, CheckCircle2, Archive, Globe } from 'lucide-react';

export default function AdminPYQsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const { data: pyqRes, isLoading } = useQuery({
    queryKey: ['admin-pyqs'],
    queryFn: () => getPYQs({ limit: 100 }).catch(() => ({ items: [] })),
  });

  const pyqs = pyqRes?.items || [];

  const createOrUpdateMutation = useMutation({
    mutationFn: (data: any) =>
      editingItem ? updatePYQ(editingItem._id, data) : createPYQ(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pyqs'] });
      setIsModalOpen(false);
      setEditingItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePYQ(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pyqs'] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updatePYQStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pyqs'] });
    },
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'examYear',
      header: 'Exam',
      cell: ({ row }) => (
        <Badge variant="primary" size="md">
          {row.original.examYear} {row.original.examType?.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Paper Title',
      cell: ({ row }) => (
        <div>
          <span className="font-bold text-[var(--text-primary)]">{row.original.title}</span>
          <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] mt-0.5">
            <span>{row.original.branch?.code || 'CSE'}</span>
            <span>•</span>
            <span>{row.original.subject?.name || 'Engineering Subject'}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Workflow Status',
      cell: ({ row }) => {
        const s = row.original.status || 'PUBLISHED';
        return (
          <Badge
            variant={
              s === 'PUBLISHED'
                ? 'success'
                : s === 'IN_REVIEW'
                ? 'warning'
                : s === 'ARCHIVED'
                ? 'neutral'
                : 'primary'
            }
          >
            {s}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'downloadsCount',
      header: 'Downloads',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-[var(--text-secondary)]">
          {row.original.downloadsCount || 0}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          {/* Status Quick Actions */}
          {row.original.status !== 'PUBLISHED' ? (
            <button
              onClick={() => statusMutation.mutate({ id: row.original._id, status: 'PUBLISHED' })}
              title="Publish Resource"
              className="p-1.5 rounded-lg text-[var(--success)] hover:bg-[var(--success-light)] transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => statusMutation.mutate({ id: row.original._id, status: 'ARCHIVED' })}
              title="Archive Resource"
              className="p-1.5 rounded-lg text-[var(--warning)] hover:bg-[var(--warning-light)] transition-colors"
            >
              <Archive className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => {
              setEditingItem(row.original);
              setIsModalOpen(true);
            }}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--surface-elevated)] transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              if (confirm(`Delete ${row.original.title}?`)) {
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
                <Badge variant="primary">Resource Bank</Badge>
              </div>
              <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
                Previous Year Question Papers (PYQs)
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                Manage university exam papers, step-by-step verified solution PDFs, and publishing lifecycles.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-hover)] transition-colors shadow-md shadow-primary/20 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Upload PYQ Paper
            </button>
          </div>

          <DataTable
            columns={columns}
            data={pyqs}
            isLoading={isLoading}
            searchPlaceholder="Search question papers by title, subject..."
            onBulkDelete={(rows) => {
              rows.forEach((r) => deleteMutation.mutate(r._id));
            }}
            onBulkPublish={(rows) => {
              rows.forEach((r) => statusMutation.mutate({ id: r._id, status: 'PUBLISHED' }));
            }}
            onBulkArchive={(rows) => {
              rows.forEach((r) => statusMutation.mutate({ id: r._id, status: 'ARCHIVED' }));
            }}
          />

          <ResourceFormModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingItem(null);
            }}
            onSubmit={async (data) => {
              await createOrUpdateMutation.mutateAsync(data);
            }}
            initialData={editingItem}
            resourceType="pyq"
            title={editingItem ? 'Edit PYQ Paper' : 'Upload Previous Year Question Paper'}
          />
        </main>
      </div>
    </div>
  );
}
