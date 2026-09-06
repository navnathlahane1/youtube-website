'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { DataTable } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/Badge';
import { getFaculty, createFaculty, updateFaculty, deleteFaculty } from '@/lib/api';
import { Plus, Trash2, Edit2, Users, Star, GraduationCap } from 'lucide-react';

export default function AdminFacultyPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: 'Senior Professor & Master Mentor',
    qualifications: 'M.Tech (IIT Bombay)',
    experienceYears: 12,
    rating: 4.9,
    studentsTrainedCount: 5000,
    bio: '',
  });

  const { data: facultyRes = [], isLoading } = useQuery({
    queryKey: ['admin-faculty'],
    queryFn: () => getFaculty().catch(() => []),
  });

  const faculty = Array.isArray(facultyRes) ? facultyRes : [];

  const createMutation = useMutation({
    mutationFn: (data: any) =>
      editingItem ? updateFaculty(editingItem._id, data) : createFaculty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-faculty'] });
      setIsModalOpen(false);
      setEditingItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFaculty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-faculty'] });
    },
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Faculty Name',
      cell: ({ row }) => (
        <div>
          <span className="font-bold text-[var(--text-primary)]">{row.original.name}</span>
          <span className="text-xs text-[var(--primary)] block">{row.original.designation}</span>
        </div>
      ),
    },
    {
      accessorKey: 'qualifications',
      header: 'Credentials & Experience',
      cell: ({ row }) => (
        <div>
          <span className="text-xs font-semibold text-[var(--text-secondary)]">{row.original.qualifications}</span>
          <span className="text-[11px] text-[var(--text-muted)] block">
            {row.original.experienceYears || 10}+ Years Teaching
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'rating',
      header: 'Student Rating',
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-xs font-bold text-warning">
          <Star className="w-3.5 h-3.5 fill-warning text-warning" />
          <span>{row.original.rating || 4.9}</span>
        </div>
      ),
    },
    {
      accessorKey: 'studentsTrainedCount',
      header: 'Mentored',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-[var(--text-secondary)]">
          {row.original.studentsTrainedCount?.toLocaleString() || '5,000'}+ Students
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
                name: row.original.name,
                designation: row.original.designation || 'Senior Professor',
                qualifications: row.original.qualifications || 'M.Tech, IIT Bombay',
                experienceYears: row.original.experienceYears || 12,
                rating: row.original.rating || 4.9,
                studentsTrainedCount: row.original.studentsTrainedCount || 5000,
                bio: row.original.bio || '',
              });
              setIsModalOpen(true);
            }}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--surface-elevated)] transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete faculty ${row.original.name}?`)) {
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
                <Badge variant="primary">Academy Mentors</Badge>
              </div>
              <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
                Distinguished Faculty Directory
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                Manage Ex-IITian faculty members, research credentials, ratings, and student mentorship records.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingItem(null);
                setFormData({
                  name: '',
                  designation: 'Senior Professor & Master Mentor',
                  qualifications: 'M.Tech (IIT Bombay)',
                  experienceYears: 12,
                  rating: 4.9,
                  studentsTrainedCount: 5000,
                  bio: '',
                });
                setIsModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-hover)] transition-colors shadow-md shadow-primary/20 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Add Faculty Mentor
            </button>
          </div>

          <DataTable columns={columns} data={faculty} isLoading={isLoading} searchPlaceholder="Search faculty members..." />

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 space-y-4 shadow-2xl">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">
                  {editingItem ? 'Edit Faculty Mentor' : 'Add Faculty Mentor'}
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    createMutation.mutate(formData);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Faculty Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. Rajesh Deshmukh"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Designation *</label>
                    <input
                      type="text"
                      required
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      placeholder="e.g. Lead Faculty - Computer & AI"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Qualifications</label>
                      <input
                        type="text"
                        value={formData.qualifications}
                        onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                        placeholder="e.g. Ph.D., IIT Delhi"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Experience (Years)</label>
                      <input
                        type="number"
                        value={formData.experienceYears}
                        onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Bio / Profile</label>
                    <textarea
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="14+ years coaching engineering toppers, specialized in Algorithm analysis and System Design..."
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
                      {createMutation.isPending ? 'Saving...' : 'Save Faculty'}
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
