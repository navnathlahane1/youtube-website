'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { DataTable } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/Badge';
import { getAcademicYears, createAcademicYear, updateAcademicYear, deleteAcademicYear } from '@/lib/api';
import { Plus, Trash2, Edit2, Calendar, FolderTree } from 'lucide-react';

export default function AcademicYearsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', code: '', yearNumber: 1 });

  const { data: years = [], isLoading } = useQuery({
    queryKey: ['admin-academic-years'],
    queryFn: () => getAcademicYears().catch(() => []),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => (editingItem ? updateAcademicYear(editingItem._id, data) : createAcademicYear(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-academic-years'] });
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({ name: '', code: '', yearNumber: 1 });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAcademicYear(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-academic-years'] });
    },
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'yearNumber',
      header: 'Year #',
      cell: ({ row }) => (
        <span className="font-bold text-[var(--primary)] font-mono">
          Year {row.original.yearNumber}
        </span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Academic Level Name',
      cell: ({ row }) => (
        <div>
          <span className="font-bold text-[var(--text-primary)]">{row.original.name}</span>
          <span className="text-[10px] text-[var(--text-muted)] block font-mono">
            Code: {row.original.code}
          </span>
        </div>
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
                name: row.original.name,
                code: row.original.code,
                yearNumber: row.original.yearNumber,
              });
              setIsModalOpen(true);
            }}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--surface-elevated)] transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete academic level ${row.original.name}?`)) {
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
                Academic Years (FE / SE / TE / BE)
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                Manage foundational engineering year tiers and progression stages.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingItem(null);
                setFormData({ name: '', code: '', yearNumber: 1 });
                setIsModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-hover)] transition-colors shadow-md shadow-primary/20 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Add Academic Level
            </button>
          </div>

          <DataTable columns={columns} data={years} isLoading={isLoading} searchPlaceholder="Search academic levels..." />

          {/* Create / Edit Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 space-y-4 shadow-2xl">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">
                  {editingItem ? 'Edit Academic Level' : 'Add Academic Level'}
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    createMutation.mutate(formData);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. First Year Engineering"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Code *</label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="e.g. FE"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Year Number *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={5}
                      value={formData.yearNumber}
                      onChange={(e) => setFormData({ ...formData, yearNumber: parseInt(e.target.value) || 1 })}
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
                      {createMutation.isPending ? 'Saving...' : 'Save Year'}
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
