'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { DataTable } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/Badge';
import { getJobs, createJob, updateJob, deleteJob, getBranches } from '@/lib/api';
import { Plus, Trash2, Edit2, Briefcase, ExternalLink, Building2 } from 'lucide-react';

export default function AdminJobsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    companyName: '',
    location: 'Pune / Hybrid',
    salaryRange: '₹8 - 14 LPA',
    jobType: 'FULL_TIME',
    workMode: 'HYBRID',
    applyUrl: '',
    description: '',
    deadline: '',
  });

  const { data: jobsRes, isLoading } = useQuery({
    queryKey: ['admin-jobs'],
    queryFn: () => getJobs({ limit: 100 }).catch(() => ({ items: [] })),
  });

  const jobs = jobsRes?.items || [];

  const createMutation = useMutation({
    mutationFn: (data: any) => (editingItem ? updateJob(editingItem._id, data) : createJob(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      setIsModalOpen(false);
      setEditingItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
    },
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'companyName',
      header: 'Company & Role',
      cell: ({ row }) => (
        <div>
          <span className="font-bold text-[var(--text-primary)]">{row.original.title}</span>
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mt-0.5">
            <Building2 className="w-3 h-3 text-[var(--primary)]" />
            <span className="font-semibold text-[var(--text-secondary)]">{row.original.companyName}</span>
            <span>•</span>
            <span>{row.original.location}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'jobType',
      header: 'Type & Mode',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Badge variant={row.original.jobType === 'INTERNSHIP' ? 'warning' : 'primary'}>
            {row.original.jobType?.replace('_', ' ')}
          </Badge>
          <span className="text-[11px] text-[var(--text-muted)]">{row.original.workMode}</span>
        </div>
      ),
    },
    {
      accessorKey: 'salaryRange',
      header: 'Compensation',
      cell: ({ row }) => (
        <span className="font-bold text-xs text-[var(--success)] font-mono">
          {row.original.salaryRange || 'Disclosed on interview'}
        </span>
      ),
    },
    {
      accessorKey: 'applicantsCount',
      header: 'Clicks',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-[var(--text-secondary)]">
          {row.original.applicantsCount || 0}
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
                companyName: row.original.companyName || '',
                location: row.original.location || 'Pune / Hybrid',
                salaryRange: row.original.salaryRange || '',
                jobType: row.original.jobType || 'FULL_TIME',
                workMode: row.original.workMode || 'HYBRID',
                applyUrl: row.original.applyUrl || '',
                description: row.original.description || '',
                deadline: row.original.deadline ? new Date(row.original.deadline).toISOString().split('T')[0] : '',
              });
              setIsModalOpen(true);
            }}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--surface-elevated)] transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete job opening ${row.original.title}?`)) {
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
                Job Board & Campus Drives
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                Manage tech, core engineering, and startup job openings, CTC packages, and direct apply URLs.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingItem(null);
                setFormData({
                  title: '',
                  slug: '',
                  companyName: '',
                  location: 'Pune / Hybrid',
                  salaryRange: '₹8 - 14 LPA',
                  jobType: 'FULL_TIME',
                  workMode: 'HYBRID',
                  applyUrl: '',
                  description: '',
                  deadline: '',
                });
                setIsModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-hover)] transition-colors shadow-md shadow-primary/20 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Post Job Opening
            </button>
          </div>

          <DataTable columns={columns} data={jobs} isLoading={isLoading} searchPlaceholder="Search job openings by company, role..." />

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 space-y-4 shadow-2xl">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">
                  {editingItem ? 'Edit Job Opening' : 'Post New Job Opening'}
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    createMutation.mutate(formData);
                  }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Company Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="e.g. NVIDIA / Veritas / Tata Tech"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Job Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          setFormData({
                            ...formData,
                            title,
                            slug: editingItem ? formData.slug : `${formData.companyName}-${title}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                          });
                        }}
                        placeholder="e.g. Graduate Software Engineer"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Job Type</label>
                      <select
                        value={formData.jobType}
                        onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                      >
                        <option value="FULL_TIME">Full Time</option>
                        <option value="INTERNSHIP">Internship</option>
                        <option value="CONTRACT">Contract</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Work Mode</label>
                      <select
                        value={formData.workMode}
                        onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                      >
                        <option value="ON_SITE">On-Site</option>
                        <option value="HYBRID">Hybrid</option>
                        <option value="REMOTE">Remote</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Salary / CTC</label>
                      <input
                        type="text"
                        value={formData.salaryRange}
                        onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                        placeholder="e.g. ₹9.5 LPA"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. Pune / Bengaluru"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Application Deadline</label>
                      <input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Apply URL (Direct Portal / Greenhouse) *</label>
                    <input
                      type="url"
                      required
                      value={formData.applyUrl}
                      onChange={(e) => setFormData({ ...formData, applyUrl: e.target.value })}
                      placeholder="https://company.wd3.myworkdayjobs.com/..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Job Description & Eligibility</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Eligibility criteria, CGPA cutoff, required coding skills and interview rounds..."
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
                      {createMutation.isPending ? 'Saving...' : 'Save Job Opening'}
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
