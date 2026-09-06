'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { DataTable } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/Badge';
import { getEvents, createEvent, updateEvent, deleteEvent } from '@/lib/api';
import { Plus, Trash2, Edit2, Calendar, MapPin } from 'lucide-react';

export default function AdminEventsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: 'WORKSHOP',
    mode: 'OFFLINE',
    venue: 'FC Road Center, Pune',
    startDate: '',
    timings: '10:00 AM - 4:00 PM',
    price: 0,
    maxCapacity: 50,
  });

  const { data: eventsRes = [], isLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: () => getEvents(false).catch(() => []),
  });

  const events = Array.isArray(eventsRes) ? eventsRes : [];

  const createMutation = useMutation({
    mutationFn: (data: any) =>
      editingItem ? updateEvent(editingItem._id, data) : createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      setIsModalOpen(false);
      setEditingItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
    },
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <Badge variant={row.original.mode === 'OFFLINE' ? 'primary' : 'neutral'}>
          {row.original.mode} {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Event Title',
      cell: ({ row }) => (
        <div>
          <span className="font-bold text-[var(--text-primary)]">{row.original.title}</span>
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mt-0.5">
            <MapPin className="w-3 h-3 text-[var(--primary)]" />
            <span>{row.original.venue}</span>
            <span>•</span>
            <span>{row.original.timings}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'startDate',
      header: 'Event Date',
      cell: ({ row }) => (
        <span className="text-xs font-semibold text-[var(--text-primary)]">
          {row.original.startDate ? new Date(row.original.startDate).toLocaleDateString() : 'TBA'}
        </span>
      ),
    },
    {
      accessorKey: 'registeredCount',
      header: 'RSVPs',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-[var(--text-secondary)]">
          {row.original.registeredCount || 0} / {row.original.maxCapacity || 50}
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
                category: row.original.category || 'WORKSHOP',
                mode: row.original.mode || 'OFFLINE',
                venue: row.original.venue || 'FC Road Center, Pune',
                startDate: row.original.startDate ? new Date(row.original.startDate).toISOString().split('T')[0] : '',
                timings: row.original.timings || '10:00 AM - 4:00 PM',
                price: row.original.price || 0,
                maxCapacity: row.original.maxCapacity || 50,
              });
              setIsModalOpen(true);
            }}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--surface-elevated)] transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete event ${row.original.title}?`)) {
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
                <Badge variant="primary">Campus Life & Outreach</Badge>
              </div>
              <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
                Workshops, Hackathons & Seminars
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                Manage weekend technical bootcamps, exam marathons, and offline student RSVP limits.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingItem(null);
                setFormData({
                  title: '',
                  slug: '',
                  description: '',
                  category: 'WORKSHOP',
                  mode: 'OFFLINE',
                  venue: 'FC Road Center, Pune',
                  startDate: '',
                  timings: '10:00 AM - 4:00 PM',
                  price: 0,
                  maxCapacity: 50,
                });
                setIsModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-hover)] transition-colors shadow-md shadow-primary/20 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Schedule Event
            </button>
          </div>

          <DataTable columns={columns} data={events} isLoading={isLoading} searchPlaceholder="Search events..." />

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 space-y-4 shadow-2xl">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">
                  {editingItem ? 'Edit Event' : 'Schedule New Event'}
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    createMutation.mutate(formData);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Event Title *</label>
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
                      placeholder="e.g. 2-Day Generative AI & Cloud Hackathon"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                      >
                        <option value="WORKSHOP">Workshop</option>
                        <option value="HACKATHON">Hackathon</option>
                        <option value="SEMINAR">Seminar</option>
                        <option value="GUEST_LECTURE">Guest Lecture</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Mode</label>
                      <select
                        value={formData.mode}
                        onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                      >
                        <option value="OFFLINE">Offline (FC Road Center)</option>
                        <option value="ONLINE">Online Webinar</option>
                        <option value="HYBRID">Hybrid</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Date</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Max RSVP Capacity</label>
                      <input
                        type="number"
                        value={formData.maxCapacity}
                        onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 50 })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Event Description</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Key takeaways, mentor introductions, hardware/software requirements..."
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
                      {createMutation.isPending ? 'Saving...' : 'Save Event'}
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
