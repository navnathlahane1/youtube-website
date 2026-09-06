'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { DataTable } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/Badge';
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '@/lib/api';
import { Plus, Trash2, Edit2, Bell, AlertCircle } from 'lucide-react';

export default function AdminAnnouncementsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'EXAM_ALERT',
    isBannerAlert: true,
    targetAudience: 'ALL',
    linkUrl: '',
  });

  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['admin-announcements'],
    queryFn: () => getAnnouncements().catch(() => []),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) =>
      editingItem ? updateAnnouncement(editingItem._id, data) : createAnnouncement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      setIsModalOpen(false);
      setEditingItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
    },
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <Badge variant={row.original.category === 'EXAM_ALERT' ? 'danger' : 'primary'} size="sm">
          {row.original.category?.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Announcement Message',
      cell: ({ row }) => (
        <div>
          <span className="font-bold text-[var(--text-primary)]">{row.original.title}</span>
          <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
            {row.original.content}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'isBannerAlert',
      header: 'Top Banner',
      cell: ({ row }) => (
        <Badge variant={row.original.isBannerAlert ? 'success' : 'neutral'}>
          {row.original.isBannerAlert ? 'ACTIVE BANNER' : 'HIDDEN'}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Posted Date',
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
              setEditingItem(row.original);
              setFormData({
                title: row.original.title,
                content: row.original.content || '',
                category: row.original.category || 'EXAM_ALERT',
                isBannerAlert: row.original.isBannerAlert ?? true,
                targetAudience: row.original.targetAudience || 'ALL',
                linkUrl: row.original.linkUrl || '',
              });
              setIsModalOpen(true);
            }}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--surface-elevated)] transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete announcement ${row.original.title}?`)) {
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
                <Badge variant="primary">Platform Notifications</Badge>
              </div>
              <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
                Announcements & Urgent Exam Alerts
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                Broadcast top notification banners across public student portal, in-sem exam timetable notices, and scholarship deadlines.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingItem(null);
                setFormData({
                  title: '',
                  content: '',
                  category: 'EXAM_ALERT',
                  isBannerAlert: true,
                  targetAudience: 'ALL',
                  linkUrl: '',
                });
                setIsModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-hover)] transition-colors shadow-md shadow-primary/20 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Broadcast Alert
            </button>
          </div>

          <DataTable columns={columns} data={announcements} isLoading={isLoading} searchPlaceholder="Search announcements..." />

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 space-y-4 shadow-2xl">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">
                  {editingItem ? 'Edit Announcement' : 'Create Broadcast Alert'}
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    createMutation.mutate(formData);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Headline *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. SPPU In-Sem Exam Timetable Released"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                    >
                      <option value="EXAM_ALERT">Exam Alert</option>
                      <option value="ADMISSION_NOTICE">Admission Notice</option>
                      <option value="WORKSHOP_ALERT">Workshop / Hackathon</option>
                      <option value="SCHOLARSHIP">Scholarship Update</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Detailed Notice Content</label>
                    <textarea
                      rows={3}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Full details, instructions for students, syllabus covered..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Action Link URL</label>
                    <input
                      type="url"
                      value={formData.linkUrl}
                      onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="isBannerAlert"
                      checked={formData.isBannerAlert}
                      onChange={(e) => setFormData({ ...formData, isBannerAlert: e.target.checked })}
                      className="rounded border-[var(--border)] text-primary"
                    />
                    <label htmlFor="isBannerAlert" className="text-xs text-[var(--text-secondary)]">
                      Show in Top Sticky Banner on Public Website
                    </label>
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
                      {createMutation.isPending ? 'Saving...' : 'Publish Notice'}
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
