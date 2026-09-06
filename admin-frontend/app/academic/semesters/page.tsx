'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { DataTable } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/Badge';
import { getSemesters, getAcademicYears, createSemester, updateSemester, deleteSemester } from '@/lib/api';
import { Plus, Trash2, Edit2, Calendar } from 'lucide-react';

export default function SemestersPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({ number: 1, name: '', academicYearId: '' });

  const { data: semesters = [], isLoading } = useQuery({
    queryKey: ['admin-semesters'],
    queryFn: () => getSemesters().catch(() => []),
  });

  const { data: years = [] } = useQuery({
    queryKey: ['admin-academic-years'],
    queryFn: () => getAcademicYears().catch(() => []),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => (editingItem ? updateSemester(editingItem._id, data) : createSemester(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-semesters'] });
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({ number: 1, name: '', academicYearId: '' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSemester(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-semesters'] });
    },
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'number',
      header: 'Semester #',
      cell: ({ row }) => (
        <span className="font-bold text-[var(--primary)] font-mono">
          Sem {row.original.number}
        </span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <span className="font-bold text-[var(--text-primary)]">{row.original.name}</span>
      ),
    },
    {
      accessorKey: 'academicYear',
      header: 'Academic Year',
      cell: ({ row }) => (
        <Badge variant="neutral">
          {row.original.academicYear?.name || row.original.academicYear?.code || 'FE/SE/TE/BE'}
        </Badge>
      ),
    },
    {
      accessorKey: 'slug',
      header: 'URL Slug',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-[var(--text-muted)]">{row.original.slug}</span>
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
                number: row.original.number,
                name: row.original.name,
                academicYearId: row.original.academicYearId || row.original.academicYear?._id || '',
              });
              setIsModalOpen(true);
            }}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--surface-elevated)] transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete Semester ${row.original.number}?`)) {
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
                Semesters (Semester 1 to 8)
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                Manage 8 semesters mapped to foundational FE, SE, TE, and BE tiers.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingItem(null);
                setFormData({ number: 1, name: '', academicYearId: years[0]?._id || '' });
                setIsModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-hover)] transition-colors shadow-md shadow-primary/20 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Add Semester
            </button>
          </div>

          <DataTable columns={columns} data={semesters} isLoading={isLoading} searchPlaceholder="Search semesters..." />

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 space-y-4 shadow-2xl">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">
                  {editingItem ? 'Edit Semester' : 'Add Semester'}
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    createMutation.mutate(formData);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Semester Number (1-8) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={8}
                      value={formData.number}
                      onChange={(e) => {
                        const num = parseInt(e.target.value) || 1;
                        setFormData({
                          ...formData,
                          number: num,
                          name: `Semester ${num}`,
                        });
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Semester Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Semester 5"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Academic Year Level</label>
                    <select
                      value={formData.academicYearId}
                      onChange={(e) => setFormData({ ...formData, academicYearId: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                    >
                      <option value="">Select Level</option>
                      {years.map((y: any) => (
                        <option key={y._id} value={y._id}>
                          {y.name} ({y.code})
                        </option>
                      ))}
                    </select>
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
                      {createMutation.isPending ? 'Saving...' : 'Save Semester'}
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
