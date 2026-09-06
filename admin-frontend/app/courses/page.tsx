'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { DataTable } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/Badge';
import { getCourses, createCourse, updateCourse, deleteCourse, getBranches } from '@/lib/api';
import { Plus, Trash2, Edit2, GraduationCap, MapPin } from 'lucide-react';

export default function AdminCoursesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: 8999,
    originalPrice: 12999,
    mode: 'OFFLINE',
    location: 'FC Road Center, Pune',
    timings: 'Morning 8:00 AM - 10:30 AM',
    seatsLeft: 12,
    branchId: '',
    durationWeeks: 12,
  });

  const { data: coursesRes = [], isLoading } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: () => getCourses().catch(() => []),
  });

  const { data: branches = [] } = useQuery({
    queryKey: ['admin-branches'],
    queryFn: () => getBranches().catch(() => []),
  });

  const courses = Array.isArray(coursesRes) ? coursesRes : [];

  const createMutation = useMutation({
    mutationFn: (data: any) =>
      editingItem ? updateCourse(editingItem._id, data) : createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      setIsModalOpen(false);
      setEditingItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
    },
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'mode',
      header: 'Mode',
      cell: ({ row }) => (
        <Badge variant={row.original.mode === 'OFFLINE' ? 'accent' : 'primary'} size="sm">
          {row.original.mode} CLASSROOM
        </Badge>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Program Title',
      cell: ({ row }) => (
        <div>
          <span className="font-bold text-[var(--text-primary)]">{row.original.title}</span>
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mt-0.5">
            <MapPin className="w-3 h-3 text-[var(--primary)]" />
            <span>{row.original.location || 'Pune Center'}</span>
            <span>•</span>
            <span>{row.original.timings}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Investment',
      cell: ({ row }) => (
        <div>
          <span className="font-bold text-xs text-[var(--text-primary)] font-mono">
            ₹{row.original.price?.toLocaleString('en-IN') || '7,999'}
          </span>
          {row.original.originalPrice && (
            <span className="text-[10px] line-through text-[var(--text-muted)] ml-1.5 font-mono">
              ₹{row.original.originalPrice?.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'seatsLeft',
      header: 'Batch Capacity',
      cell: ({ row }) => (
        <span className="text-xs font-bold text-danger bg-danger-light px-2 py-0.5 rounded-full border border-danger/20">
          {row.original.seatsLeft || 8} Seats Left
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
                price: row.original.price || 8999,
                originalPrice: row.original.originalPrice || 12999,
                mode: row.original.mode || 'OFFLINE',
                location: row.original.location || 'FC Road Center, Pune',
                timings: row.original.timings || 'Morning 8:00 AM - 10:30 AM',
                seatsLeft: row.original.seatsLeft || 12,
                branchId: row.original.branchId || row.original.branch?._id || '',
                durationWeeks: row.original.durationWeeks || 12,
              });
              setIsModalOpen(true);
            }}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--surface-elevated)] transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete course ${row.original.title}?`)) {
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
                <Badge variant="primary">Offline Learning Center</Badge>
              </div>
              <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
                Classroom Courses & Live Batches
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                Manage Pune center classroom courses, batch schedules, fees, and seat quotas.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingItem(null);
                setFormData({
                  title: '',
                  slug: '',
                  description: '',
                  price: 8999,
                  originalPrice: 12999,
                  mode: 'OFFLINE',
                  location: 'FC Road Center, Pune',
                  timings: 'Morning 8:00 AM - 10:30 AM',
                  seatsLeft: 12,
                  branchId: branches[0]?._id || '',
                  durationWeeks: 12,
                });
                setIsModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-hover)] transition-colors shadow-md shadow-primary/20 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Add Classroom Batch
            </button>
          </div>

          <DataTable columns={columns} data={courses} isLoading={isLoading} searchPlaceholder="Search courses..." />

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 space-y-4 shadow-2xl">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">
                  {editingItem ? 'Edit Classroom Course' : 'Add Classroom Course Batch'}
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    createMutation.mutate(formData);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Course Title *</label>
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
                      placeholder="e.g. SPPU TE Computer Full Semester Classroom Master Batch"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Discounted Price (₹) *</label>
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Original Price (₹)</label>
                      <input
                        type="number"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({ ...formData, originalPrice: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Classroom Mode</label>
                      <select
                        value={formData.mode}
                        onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                      >
                        <option value="OFFLINE">Offline Classroom</option>
                        <option value="HYBRID">Hybrid (Offline + Live)</option>
                        <option value="ONLINE">Online Interactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Seats Remaining</label>
                      <input
                        type="number"
                        value={formData.seatsLeft}
                        onChange={(e) => setFormData({ ...formData, seatsLeft: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Center Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. FC Road Center, Pune"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Timings</label>
                      <input
                        type="text"
                        value={formData.timings}
                        onChange={(e) => setFormData({ ...formData, timings: e.target.value })}
                        placeholder="e.g. 8:00 AM - 10:30 AM"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Batch Description</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Included hardcopy study material, mock test series, and 1-on-1 doubt sessions..."
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
                      {createMutation.isPending ? 'Saving...' : 'Save Course'}
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
