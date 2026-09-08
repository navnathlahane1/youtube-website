'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { DataTable } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/Badge';
import { getJobs, createJob, updateJob, deleteJob } from '@/lib/api';
import { Plus, Trash2, Edit2, ExternalLink, Building2, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AdminJobsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const initialFormData = {
    title: '',
    slug: '',
    companyName: '',
    location: 'Pune / Hybrid',
    salaryRange: '₹8 - 14 LPA',
    salaryOrStipend: '₹8 - 14 LPA',
    jobType: 'OFF_CAMPUS',
    workMode: 'HYBRID',
    applyUrl: '',
    whatsappCommunityUrl: 'https://whatsapp.com/channel/0029VbDKVvNHrDZgmPJIav3O',
    eligibility: 'Freshers & Experienced (2024, 2025, 2026 Batches)',
    description: '',
    deadline: '',
    status: 'PUBLISHED',
  };

  const [formData, setFormData] = useState(initialFormData);

  const { data: jobsRes, isLoading } = useQuery({
    queryKey: ['admin-jobs'],
    queryFn: () => getJobs({ limit: 100 }).catch(() => ({ items: [] })),
  });

  const jobs = jobsRes?.items || [];

  const createMutation = useMutation({
    mutationFn: (data: any) => {
      const payload = {
        ...data,
        salaryOrStipend: data.salaryRange || data.salaryOrStipend || 'Best in Industry',
        salaryRange: data.salaryRange || data.salaryOrStipend || 'Best in Industry',
        applicationDeadline: data.deadline ? new Date(data.deadline) : undefined,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
        status: data.status || 'PUBLISHED',
        whatsappCommunityUrl: data.whatsappCommunityUrl || 'https://whatsapp.com/channel/0029VbDKVvNHrDZgmPJIav3O',
      };
      return editingItem ? updateJob(editingItem._id, payload) : createJob(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      setIsModalOpen(false);
      setEditingItem(null);
      setErrorMessage(null);
      setSuccessMessage('Job opening saved and published successfully!');
      setTimeout(() => setSuccessMessage(null), 4000);
    },
    onError: (err: any) => {
      setErrorMessage(err?.message || 'Failed to save job opening. Please check required fields.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      setSuccessMessage('Job deleted successfully.');
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (err: any) => {
      setErrorMessage(err?.message || 'Failed to delete job.');
    },
  });

  const loadAmazonTemplate = () => {
    setFormData({
      title: 'Associate, ML Data Operations',
      slug: 'amazon-associate-ml-data-operations-2026',
      companyName: 'Amazon',
      location: 'Hyderabad / Chennai / Pune / Hybrid',
      salaryRange: '₹4.5 - 7.5 LPA',
      salaryOrStipend: '₹4.5 - 7.5 LPA',
      jobType: 'OFF_CAMPUS',
      workMode: 'HYBRID',
      applyUrl: 'https://www.amazon.jobs/en/jobs/3134249/associate-ml-data-operations-go-ai-operations?utm_source=chatgpt.com',
      whatsappCommunityUrl: 'https://whatsapp.com/channel/0029VbDKVvNHrDZgmPJIav3O',
      eligibility: 'Freshers & Experienced',
      description: `Amazon is hiring for the Associate, ML Data Operations role. This is a great opportunity for candidates interested in Machine Learning, Data Operations, AI and technology.

🔹 Work with machine-learning related data operations
🔹 Support data quality and annotation processes
🔹 Work with operational and technical teams
🔹 Opportunity to gain experience in a global technology company`,
      deadline: '2026-12-31',
      status: 'PUBLISHED',
    });
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'companyName',
      header: 'Company & Role',
      cell: ({ row }) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--text-primary)]">{row.original.title}</span>
            {row.original.status === 'DRAFT' && (
              <Badge variant="warning" className="text-[10px] py-0 px-1.5">DRAFT</Badge>
            )}
          </div>
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
          {row.original.salaryRange || row.original.salaryOrStipend || 'Disclosed on interview'}
        </span>
      ),
    },
    {
      accessorKey: 'applicantsCount',
      header: 'Clicks',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-[var(--text-secondary)]">
          {row.original.applicantsCount || row.original.clickCount || 0}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          {row.original.applyUrl && (
            <a
              href={row.original.applyUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--surface-elevated)] transition-colors"
              title="Open Apply Link"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            onClick={() => {
              setEditingItem(row.original);
              setErrorMessage(null);
              setFormData({
                title: row.original.title || '',
                slug: row.original.slug || '',
                companyName: row.original.companyName || '',
                location: row.original.location || 'Pune / Hybrid',
                salaryRange: row.original.salaryRange || row.original.salaryOrStipend || '₹8 - 14 LPA',
                salaryOrStipend: row.original.salaryOrStipend || row.original.salaryRange || '₹8 - 14 LPA',
                jobType: row.original.jobType || 'OFF_CAMPUS',
                workMode: row.original.workMode || 'HYBRID',
                applyUrl: row.original.applyUrl || '',
                whatsappCommunityUrl: row.original.whatsappCommunityUrl || 'https://whatsapp.com/channel/0029VbDKVvNHrDZgmPJIav3O',
                eligibility: row.original.eligibility || 'Freshers & Experienced',
                description: row.original.description || '',
                deadline: row.original.deadline || row.original.applicationDeadline
                  ? new Date(row.original.deadline || row.original.applicationDeadline).toISOString().split('T')[0]
                  : '',
                status: row.original.status || 'PUBLISHED',
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
          {successMessage && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="primary">Careers Management</Badge>
              </div>
              <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
                Job Board & Campus Drives
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                Manage tech, core engineering, off-campus hiring drives, CTC packages, and direct apply URLs.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingItem(null);
                setErrorMessage(null);
                setFormData(initialFormData);
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
              <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 space-y-4 shadow-2xl my-8">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                  <div>
                    <h3 className="font-bold text-base text-[var(--text-primary)]">
                      {editingItem ? 'Edit Job Opening' : 'Post New Job Opening'}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">Live on website front page & career job board</p>
                  </div>
                  {!editingItem && (
                    <button
                      type="button"
                      onClick={loadAmazonTemplate}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" /> Load Amazon 2026 Template
                    </button>
                  )}
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setErrorMessage(null);
                    createMutation.mutate(formData);
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Company Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="e.g. Amazon / NVIDIA / Microsoft"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Job Title / Role *</label>
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
                        placeholder="e.g. Associate, ML Data Operations"
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
                        <option value="OFF_CAMPUS">Off-Campus Hiring</option>
                        <option value="FULL_TIME">Full Time</option>
                        <option value="INTERNSHIP">Internship</option>
                        <option value="CORE_DRIVE">Core Engineering Drive</option>
                        <option value="CONTRACT">Contract</option>
                        <option value="APPRENTICESHIP">Apprenticeship</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Work Mode</label>
                      <select
                        value={formData.workMode}
                        onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                      >
                        <option value="HYBRID">Hybrid</option>
                        <option value="ON_SITE">On-Site</option>
                        <option value="REMOTE">Remote</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Salary / CTC</label>
                      <input
                        type="text"
                        value={formData.salaryRange}
                        onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value, salaryOrStipend: e.target.value })}
                        placeholder="e.g. ₹4.5 - 7.5 LPA"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] font-mono"
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
                        placeholder="e.g. Hyderabad / Pune / Hybrid"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Eligibility Criteria</label>
                      <input
                        type="text"
                        value={formData.eligibility}
                        onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                        placeholder="e.g. Freshers & Experienced"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Application Deadline</label>
                      <input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] font-semibold"
                      >
                        <option value="PUBLISHED">Published (Live on Website)</option>
                        <option value="DRAFT">Draft</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Apply URL (Direct Portal / Official Application) *</label>
                    <input
                      type="url"
                      required
                      value={formData.applyUrl}
                      onChange={(e) => setFormData({ ...formData, applyUrl: e.target.value })}
                      placeholder="https://www.amazon.jobs/en/jobs/..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">WhatsApp Community / Channel URL</label>
                    <input
                      type="url"
                      value={formData.whatsappCommunityUrl}
                      onChange={(e) => setFormData({ ...formData, whatsappCommunityUrl: e.target.value })}
                      placeholder="https://whatsapp.com/channel/..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Job Description, Key Roles & Instructions</label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Job role overview, work with machine-learning related data operations, support data quality, eligibility..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] font-sans leading-relaxed"
                    />
                  </div>

                  <div className="pt-3 border-t border-[var(--border)] flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--border)] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createMutation.isPending}
                      className="px-5 py-2 text-xs font-bold rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors shadow-md shadow-primary/20 disabled:opacity-50"
                    >
                      {createMutation.isPending ? 'Saving...' : editingItem ? 'Update Job Opening' : 'Publish Job Opening'}
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
