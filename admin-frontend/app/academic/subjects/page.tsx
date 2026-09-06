'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { DataTable } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/Badge';
import { getSubjects, getBranches, getSemesters, createSubject, updateSubject, deleteSubject } from '@/lib/api';
import { Plus, Trash2, Edit2, BookOpen, Layers } from 'lucide-react';

export default function SubjectsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    slug: '',
    credits: 4,
    branchId: '',
    semesterId: '',
    description: '',
  });

  const { data: subjects = [], isLoading } = useQuery({
    queryKey: ['admin-subjects'],
    queryFn: () => getSubjects().catch(() => []),
  });

  const { data: branches = [] } = useQuery({
    queryKey: ['admin-branches'],
    queryFn: () => getBranches().catch(() => []),
  });

  const { data: semesters = [] } = useQuery({
    queryKey: ['admin-semesters'],
    queryFn: () => getSemesters().catch(() => []),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => (editingItem ? updateSubject(editingItem._id, data) : createSubject(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
      setIsModalOpen(false);
      setEditingItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
    },
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'code',
      header: 'Subject Code',
      cell: ({ row }) => (
        <Badge variant="accent" size="md">
          {row.original.code}
        </Badge>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Subject Name',
      cell: ({ row }) => (
        <div>
          <span className="font-bold text-[var(--text-primary)]">{row.original.name}</span>
          <p className="text-[11px] text-[var(--text-muted)] line-clamp-1">
            {row.original.description || 'Engineering curriculum course'}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'branch',
      header: 'Branch & Sem',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Badge variant="primary">
            {row.original.branch?.code || 'CSE'}
          </Badge>
          <span className="text-xs text-[var(--text-muted)]">
            Sem {row.original.semester?.number || '5'}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'credits',
      header: 'Credits',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-[var(--text-secondary)]">
          {row.original.credits || 4} Credits
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingItem(row.original);
              setFormData({
                name: row.original.name,
                code: row.original.code,
                slug: row.original.slug || '',
                credits: row.original.credits || 4,
                branchId: row.original.branchId || row.original.branch?._id || '',
                semesterId: row.original.semesterId || row.original.semester?._id || '',
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
              if (confirm(`Delete subject ${row.original.name}?`)) {
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
                <Badge variant="primary">Academic Hierarchy</Badge>
              </div>
              <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
                Subjects & Unit Breakdown
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                Manage university subjects, unit weightages, credit allocations, and Subject Hub landing aggregators.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingItem(null);
                setFormData({
                  name: '',
                  code: '',
                  slug: '',
                  credits: 4,
                  branchId: branches[0]?._id || '',
                  semesterId: semesters[0]?._id || '',
                  description: '',
                });
                setIsModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-hover)] transition-colors shadow-md shadow-primary/20 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Add Subject
            </button>
          </div>

          <DataTable columns={columns} data={subjects} isLoading={isLoading} searchPlaceholder="Search subjects by name or code..." />

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 space-y-4 shadow-2xl">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">
                  {editingItem ? 'Edit Subject' : 'Add Subject'}
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    createMutation.mutate(formData);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Subject Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setFormData({
                          ...formData,
                          name,
                          slug: editingItem ? formData.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                        });
                      }}
                      placeholder="e.g. Database Management Systems"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Subject Code *</label>
                      <input
                        type="text"
                        required
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        placeholder="e.g. CS301"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Credits</label>
                      <input
                        type="number"
                        min={1}
                        max={6}
                        value={formData.credits}
                        onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 4 })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Branch</label>
                      <select
                        value={formData.branchId}
                        onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                      >
                        <option value="">Select Branch</option>
                        {branches.map((b: any) => (
                          <option key={b._id} value={b._id}>{b.code} ({b.name})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Semester</label>
                      <select
                        value={formData.semesterId}
                        onChange={(e) => setFormData({ ...formData, semesterId: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                      >
                        <option value="">Select Semester</option>
                        {semesters.map((s: any) => (
                          <option key={s._id} value={s._id}>Sem {s.number}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Syllabus Description</label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Core concepts, ER modeling, SQL, normalization, concurrency..."
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
                      {createMutation.isPending ? 'Saving...' : 'Save Subject'}
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
