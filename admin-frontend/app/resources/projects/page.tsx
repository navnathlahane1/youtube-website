'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { DataTable } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/Badge';
import { ResourceFormModal } from '@/components/forms/ResourceFormModal';
import { getProjects, createProject, updateProject, deleteProject } from '@/lib/api';
import { Plus, Trash2, Edit2, Code, ExternalLink, Github } from 'lucide-react';

export default function AdminProjectsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const { data: projectsRes, isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: () => getProjects({ limit: 100 }).catch(() => ({ items: [] })),
  });

  const projects = projectsRes?.items || [];

  const createOrUpdateMutation = useMutation({
    mutationFn: (data: any) =>
      editingItem ? updateProject(editingItem._id, data) : createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      setIsModalOpen(false);
      setEditingItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
    },
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'category',
      header: 'Level',
      cell: ({ row }) => (
        <Badge variant={row.original.category === 'CAPSTONE_MAJOR' ? 'accent' : 'primary'} size="sm">
          {row.original.category?.replace('_', ' ') || 'PROJECT'}
        </Badge>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Project Title & Tech Stack',
      cell: ({ row }) => (
        <div>
          <span className="font-bold text-[var(--text-primary)]">{row.original.title}</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {row.original.techStack?.slice(0, 3).map((t: string, i: number) => (
              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface-elevated)] text-[var(--text-muted)] font-mono">
                {t}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'difficulty',
      header: 'Difficulty',
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.difficulty === 'ADVANCED'
              ? 'danger'
              : row.original.difficulty === 'INTERMEDIATE'
              ? 'warning'
              : 'success'
          }
        >
          {row.original.difficulty || 'MEDIUM'}
        </Badge>
      ),
    },
    {
      accessorKey: 'viewsCount',
      header: 'Views',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-[var(--text-secondary)]">
          {row.original.viewsCount || 0}
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
              setIsModalOpen(true);
            }}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--surface-elevated)] transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete project ${row.original.title}?`)) {
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
                Engineering Capstone & Mini Projects
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                Manage final year major capstones, mini semester projects, source code repos, and project report documentation.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-hover)] transition-colors shadow-md shadow-primary/20 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Add Capstone Project
            </button>
          </div>

          <DataTable
            columns={columns}
            data={projects}
            isLoading={isLoading}
            searchPlaceholder="Search projects by title, tech stack..."
            onBulkDelete={(rows) => rows.forEach((r) => deleteMutation.mutate(r._id))}
          />

          <ResourceFormModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingItem(null);
            }}
            onSubmit={async (data) => {
              await createOrUpdateMutation.mutateAsync(data);
            }}
            initialData={editingItem}
            resourceType="project"
            title={editingItem ? 'Edit Capstone Project' : 'Add Engineering Capstone Project'}
          />
        </main>
      </div>
    </div>
  );
}
