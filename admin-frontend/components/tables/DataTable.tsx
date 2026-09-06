'use client';

import React, { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Search,
  Download,
  SlidersHorizontal,
  Trash2,
  CheckCircle,
  Archive,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  onBulkDelete?: (selectedRows: TData[]) => void;
  onBulkPublish?: (selectedRows: TData[]) => void;
  onBulkArchive?: (selectedRows: TData[]) => void;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = 'Search records...',
  onBulkDelete,
  onBulkPublish,
  onBulkArchive,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [showColMenu, setShowColMenu] = useState(false);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows.map((r) => r.original);

  const exportToCSV = () => {
    if (!data.length) return;
    const headers = table.getVisibleLeafColumns().map((col) => col.id).join(',');
    const rows = data.map((row: any) =>
      table
        .getVisibleLeafColumns()
        .map((col) => {
          const val = row[col.id];
          return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val ?? '';
        })
        .join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Bulk Actions Menu if rows selected */}
          {selectedRows.length > 0 && (
            <div className="flex items-center gap-1.5 p-1 bg-[var(--surface-elevated)] rounded-xl border border-[var(--border)]">
              <span className="text-[11px] text-[var(--text-muted)] px-2 font-mono">
                {selectedRows.length} selected
              </span>
              {onBulkPublish && (
                <button
                  onClick={() => onBulkPublish(selectedRows)}
                  title="Bulk Publish"
                  className="p-1.5 rounded-lg text-[var(--success)] hover:bg-[var(--success-light)] transition-colors text-xs flex items-center gap-1"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                </button>
              )}
              {onBulkArchive && (
                <button
                  onClick={() => onBulkArchive(selectedRows)}
                  title="Bulk Archive"
                  className="p-1.5 rounded-lg text-[var(--warning)] hover:bg-[var(--warning-light)] transition-colors text-xs flex items-center gap-1"
                >
                  <Archive className="w-3.5 h-3.5" />
                </button>
              )}
              {onBulkDelete && (
                <button
                  onClick={() => {
                    if (confirm(`Delete ${selectedRows.length} selected items?`)) {
                      onBulkDelete(selectedRows);
                    }
                  }}
                  title="Bulk Delete"
                  className="p-1.5 rounded-lg text-[var(--danger)] hover:bg-[var(--danger-light)] transition-colors text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Export CSV */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {/* Column Visibility Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowColMenu(!showColMenu)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Columns</span>
            </button>

            {showColMenu && (
              <div className="absolute right-0 mt-2 w-48 p-2 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-2xl z-30 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] px-2 block mb-1">
                  Toggle Columns
                </span>
                {table.getAllLeafColumns().map((column) => {
                  return (
                    <label
                      key={column.id}
                      className="flex items-center gap-2 px-2 py-1 text-xs text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] rounded-lg cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={column.getIsVisible()}
                        onChange={column.getToggleVisibilityHandler()}
                        className="rounded border-[var(--border)] text-[var(--primary)]"
                      />
                      <span>{column.id}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[var(--text-secondary)]">
            <thead className="bg-[var(--surface-elevated)] text-[var(--text-muted)] uppercase tracking-wider font-mono text-[10px] border-b border-[var(--border)]">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3 font-bold">
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? 'flex items-center gap-1 cursor-pointer select-none hover:text-[var(--text-primary)]'
                              : ''
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <ArrowUpDown className="w-3 h-3 text-[var(--text-muted)]" />
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y divide-[var(--border-subtle)]">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-[var(--text-muted)]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span>Loading table data...</span>
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="hover:bg-[var(--surface-elevated)]/50 transition-colors data-[selected=true]:bg-[var(--primary-light)]"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-text-primary">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-[var(--text-muted)]">
                    No records found matching current query or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 py-3 bg-[var(--surface-elevated)]/50 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <span>
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
            </span>
            <span>•</span>
            <span>{table.getFilteredRowModel().rows.length} Total Records</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] disabled:opacity-30 hover:text-[var(--text-primary)] transition-opacity"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] disabled:opacity-30 hover:text-[var(--text-primary)] transition-opacity"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] disabled:opacity-30 hover:text-[var(--text-primary)] transition-opacity"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] disabled:opacity-30 hover:text-[var(--text-primary)] transition-opacity"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>

            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="ml-2 px-2 py-1 text-xs rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
            >
              {[10, 20, 30, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
