'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { DataTable } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/Badge';
import { getCareerRoadmaps, createCareerRoadmap, updateCareerRoadmap, deleteCareerRoadmap } from '@/lib/api';
import { Plus, Trash2, Edit2, Compass, BookOpen } from 'lucide-react';

export default function AdminCareerRoadmapsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    type: 'ROADMAP',
    domain: 'Software Engineering',
    description: '',
  });

  const { data: roadmapsRes = [], isLoading } = useQuery({
    queryKey: ['admin-roadmaps'],
    queryFn: () => getCareerRoadmaps().catch(() => []),
  });

  const roadmaps = Array.isArray(roadmapsRes) ? roadmapsRes : [];

  const createMutation = useMutation({
    mutationFn: (data: any) =>
      editingItem ? updateCareerRoadmap(editingItem._id, data) : createCareerRoadmap(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roadmaps'] });
      setIsModalOpen(false);
      setEditingItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCareerRoadmap(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roadmaps'] });
    },
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'type',
      header: 'Category',
      cell: ({ row }) => (
        <Badge variant={row.original.type === 'GATE_PREP' ? 'warning' : 'primary'}>
          {row.original.type?.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Roadmap / Guide Title',
      cell: ({ row }) => (
        <div>
          <span className="font-bold text-[var(--text-primary)]">{row.original.title}</span>
          <p className="text-[11px] text-[var(--text-muted)] line-clamp-1">
            {row.original.description}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'domain',
      header: 'Technical Domain',
      cell: ({ row }) => (
        <span className="text-xs font-semibold text-[var(--text-secondary)]">
          {row.original.domain || 'Engineering Core'}
        </span>
      ),
    },
    {
      accessorKey: 'stages',
      header: 'Milestones',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-[var(--text-secondary)]">
          {row.original.stages?.length || 4} Stages
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
                type: row.original.type || 'ROADMAP',
                domain: row.original.domain || 'Software Engineering',
                description: row.original.description || '',
              });
              setIsModalOpen(true);
            }}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--surface-elevated)] transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete roadmap ${row.original.title}?`)) {
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
                <Badge variant="primary">Careers Management</Badge>
              </div>
              <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
                Career Roadmaps & GATE Strategy Guides
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                Manage structured career progression stages, subject checklists, and interview guides.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingItem(null);
                setFormData({
                  title: '',
                  slug: '',
                  type: 'ROADMAP',
                  domain: 'Software Engineering',
                  description: '',
                });
                setIsModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-hover)] transition-colors shadow-md shadow-primary/20 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Add Roadmap
            </button>
          </div>

          <DataTable columns={columns} data={roadmaps} isLoading={isLoading} searchPlaceholder="Search roadmaps by title, domain..." />

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 space-y-4 shadow-2xl">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">
                  {editingItem ? 'Edit Roadmap' : 'Add Career Roadmap'}
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    createMutation.mutate(formData);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Title *</label>
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
                      placeholder="e.g. SDE Roadmap: Zero to Tier-1 Product Companies"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                      >
                        <option value="ROADMAP">Skill Roadmap</option>
                        <option value="GATE_PREP">GATE Exam Guide</option>
                        <option value="INTERVIEW_GUIDE">Interview Prep</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Domain</label>
                      <input
                        type="text"
                        value={formData.domain}
                        onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                        placeholder="e.g. Full Stack"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Overview of roadmap stages and targeted salary tiers..."
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
                      {createMutation.isPending ? 'Saving...' : 'Save Roadmap'}
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
