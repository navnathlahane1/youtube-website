'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { DataTable } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/Badge';
import { getPlaylists, createPlaylist, updatePlaylist, deletePlaylist, getBranches } from '@/lib/api';
import { Plus, Trash2, Edit2, ListVideo } from 'lucide-react';

export default function AdminPlaylistsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    branchId: '',
    playlistUrl: '',
    videoCount: 10,
  });

  const { data: playlistsRes, isLoading } = useQuery({
    queryKey: ['admin-playlists'],
    queryFn: () => getPlaylists().catch(() => ({ items: [] })),
  });

  const { data: branches = [] } = useQuery({
    queryKey: ['admin-branches'],
    queryFn: () => getBranches().catch(() => []),
  });

  const playlists = playlistsRes?.items || [];

  const createMutation = useMutation({
    mutationFn: (data: any) =>
      editingItem ? updatePlaylist(editingItem._id, data) : createPlaylist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-playlists'] });
      setIsModalOpen(false);
      setEditingItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePlaylist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-playlists'] });
    },
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Playlist Title',
      cell: ({ row }) => (
        <div>
          <span className="font-bold text-[var(--text-primary)]">{row.original.title}</span>
          <p className="text-[11px] text-[var(--text-muted)] line-clamp-1">
            {row.original.description || 'Subject crash course series'}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'branch',
      header: 'Branch',
      cell: ({ row }) => (
        <Badge variant="primary">{row.original.branch?.code || 'ALL'}</Badge>
      ),
    },
    {
      accessorKey: 'videoCount',
      header: 'Videos',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-[var(--text-secondary)]">
          {row.original.videoCount || 0} Lectures
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
              setFormData({
                title: row.original.title,
                slug: row.original.slug || '',
                description: row.original.description || '',
                branchId: row.original.branchId || row.original.branch?._id || '',
                playlistUrl: row.original.playlistUrl || '',
                videoCount: row.original.videoCount || 10,
              });
              setIsModalOpen(true);
            }}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--surface-elevated)] transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete playlist ${row.original.title}?`)) {
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
                Subject Video Playlists & Crash Courses
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                Curate multi-part YouTube playlists and university syllabus marathons.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingItem(null);
                setFormData({
                  title: '',
                  slug: '',
                  description: '',
                  branchId: branches[0]?._id || '',
                  playlistUrl: '',
                  videoCount: 10,
                });
                setIsModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-hover)] transition-colors shadow-md shadow-primary/20 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Add Playlist
            </button>
          </div>

          <DataTable columns={columns} data={playlists} isLoading={isLoading} searchPlaceholder="Search playlists..." />

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 space-y-4 shadow-2xl">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">
                  {editingItem ? 'Edit Playlist' : 'Add Playlist'}
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    createMutation.mutate(formData);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Playlist Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        setFormData({
                          ...formData,
                          title,
                          slug: editingItem ? formData.slug : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                        });
                      }}
                      placeholder="e.g. Engineering Mathematics 3 Complete Crash Course"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Branch</label>
                    <select
                      value={formData.branchId}
                      onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                    >
                      <option value="">All Branches</option>
                      {branches.map((b: any) => (
                        <option key={b._id} value={b._id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Playlist URL *</label>
                    <input
                      type="url"
                      required
                      value={formData.playlistUrl}
                      onChange={(e) => setFormData({ ...formData, playlistUrl: e.target.value })}
                      placeholder="https://youtube.com/playlist?list=..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Number of Videos</label>
                    <input
                      type="number"
                      value={formData.videoCount}
                      onChange={(e) => setFormData({ ...formData, videoCount: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] text-[var(--text-secondary)]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createMutation.isPending}
                      className="px-4 py-2 text-xs font-bold rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
                    >
                      {createMutation.isPending ? 'Saving...' : 'Save Playlist'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
