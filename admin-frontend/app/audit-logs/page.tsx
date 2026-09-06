'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { DataTable } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/Badge';
import { getAuditLogs } from '@/lib/api';
import { ShieldAlert, User, Clock, Terminal } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const { data: logsRes, isLoading } = useQuery({
    queryKey: ['admin-audit-logs'],
    queryFn: () => getAuditLogs({ limit: 100 }).catch(() => ({ items: [] })),
  });

  const logs = logsRes?.items || [];

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => {
        const action = row.original.action || 'MUTATION';
        const isDelete = action.includes('DELETE');
        const isCreate = action.includes('CREATE') || action.includes('UPLOAD');
        return (
          <Badge variant={isDelete ? 'danger' : isCreate ? 'success' : 'primary'} size="sm">
            {action}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'module',
      header: 'Module & Entity',
      cell: ({ row }) => (
        <div>
          <span className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[11px] font-mono">
            {row.original.module || 'SYSTEM'}
          </span>
          {row.original.entityId && (
            <span className="text-[10px] text-[var(--text-muted)] block font-mono truncate max-w-[120px]">
              ID: {row.original.entityId}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'actor',
      header: 'Actor & IP Address',
      cell: ({ row }) => (
        <div>
          <span className="font-semibold text-xs text-[var(--text-primary)]">
            {row.original.adminEmail || row.original.actorName || 'Super Admin'}
          </span>
          <span className="text-[10px] text-[var(--text-muted)] block font-mono">
            IP: {row.original.ipAddress || '127.0.0.1'}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Timestamp',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-[var(--text-muted)]">
          {new Date(row.original.createdAt).toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--bg-main)]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="danger">Security & Compliance</Badge>
            </div>
            <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
              Immutable Admin Audit Logs
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              Complete chronological audit trail recording all administrative mutations, publishing approvals, and security events.
            </p>
          </div>

          <DataTable columns={columns} data={logs} isLoading={isLoading} searchPlaceholder="Search audit logs by actor, action, module..." />
        </main>
      </div>
    </div>
  );
}
