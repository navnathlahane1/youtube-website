'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { DataTable } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/Badge';
import { ResourceFormModal } from '@/components/forms/ResourceFormModal';
import { getVideos, createVideo, updateVideo, deleteVideo } from '@/lib/api';
import { Plus, Trash2, Edit2, Video, Eye } from 'lucide-react';

export default function AdminVideosPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const { data: videosRes, isLoading } = useQuery({
    queryKey: ['admin-videos'],
    queryFn: () => getVideos({ limit: 100 }).catch(() => ({ items: [] })),
  });

  const videos = videosRes?.items || [];

  const createOrUpdateMutation = useMutation({
    mutationFn: (data: any) =>
      editingItem ? updateVideo(editingItem._id, data) : createVideo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      setIsModalOpen(false);
      setEditingItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVideo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
    },
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Video Lecture',
      cell: ({ row }) => (
        <div>
          <span className="font-bold text-[var(--text-primary)]">{row.original.title}</span>
          <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] mt-0.5">
            <span>{row.original.branch?.code || 'CSE'}</span>
            <span>•</span>
            <span>{row.original.subject?.name || 'Subject'}</span>
            {row.original.duration && <span>• {row.original.duration}</span>}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'videoUrl',
      header: 'YouTube / Embed URL',
      cell: ({ row }) => (
        <a
          href={row.original.videoUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[var(--primary)] hover:underline truncate block max-w-xs font-mono"
        >
          {row.original.videoUrl || 'https://youtube.com/...'}
        </a>
      ),
    },
    {
      accessorKey: 'viewsCount',
      header: 'Telemetry Views',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-[var(--text-secondary)]">
          {row.original.viewsCount || 0}
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
              setEditingItem(row.original);
              setIsModalOpen(true);
            }}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--surface-elevated)] transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete video ${row.original.title}?`)) {
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
                Curated Video Lectures
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                Manage YouTube video embeds, timestamp indices, and topic-wise crash courses.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-hover)] transition-colors shadow-md shadow-primary/20 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Add Video Lecture
            </button>
          </div>

          <DataTable
            columns={columns}
            data={videos}
            isLoading={isLoading}
            searchPlaceholder="Search video lectures..."
            onBulkDelete={(rows) => rows.forEach((r) => deleteMutation.mutate(r._id))}
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
            resourceType="video"
            title={editingItem ? 'Edit Video Lecture' : 'Add Video Lecture'}
          />
        </main>
      </div>
    </div>
  );
}
