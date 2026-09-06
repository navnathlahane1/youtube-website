'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { DataTable } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/Badge';
import { ResourceFormModal } from '@/components/forms/ResourceFormModal';
import { getNotes, createNote, updateNote, deleteNote, updateNoteStatus } from '@/lib/api';
import { Plus, Trash2, Edit2, BookOpen, CheckCircle2, Archive } from 'lucide-react';

export default function AdminNotesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const { data: notesRes, isLoading } = useQuery({
    queryKey: ['admin-notes'],
    queryFn: () => getNotes({ limit: 100 }).catch(() => ({ items: [] })),
  });

  const notes = notesRes?.items || [];

  const createOrUpdateMutation = useMutation({
    mutationFn: (data: any) =>
      editingItem ? updateNote(editingItem._id, data) : createNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notes'] });
      setIsModalOpen(false);
      setEditingItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notes'] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateNoteStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notes'] });
    },
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant={row.original.isHandwritten ? 'accent' : 'primary'} size="sm">
          {row.original.isHandwritten ? 'Handwritten' : 'Master Printed'}
        </Badge>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Notes Title',
      cell: ({ row }) => (
        <div>
          <span className="font-bold text-[var(--text-primary)]">{row.original.title}</span>
          <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] mt-0.5">
            <span>{row.original.branch?.code || 'CSE'}</span>
            <span>•</span>
            <span>{row.original.subject?.name || 'Subject'}</span>
            {row.original.author && <span>• By {row.original.author}</span>}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
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
                Handwritten & Faculty Master Notes
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                Manage unit summaries, topper handwritten formula books, and lecture PDF assets.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-hover)] transition-colors shadow-md shadow-primary/20 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Upload Notes PDF
            </button>
          </div>

          <DataTable
            columns={columns}
            data={notes}
            isLoading={isLoading}
            searchPlaceholder="Search notes by subject, unit, author..."
            onBulkDelete={(rows) => rows.forEach((r) => deleteMutation.mutate(r._id))}
            onBulkPublish={(rows) => rows.forEach((r) => statusMutation.mutate({ id: r._id, status: 'PUBLISHED' }))}
            onBulkArchive={(rows) => rows.forEach((r) => statusMutation.mutate({ id: r._id, status: 'ARCHIVED' }))}
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
            resourceType="note"
            title={editingItem ? 'Edit Notes' : 'Upload Engineering Notes PDF'}
          />
        </main>
      </div>
    </div>
  );
}
