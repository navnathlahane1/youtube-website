'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { Badge } from '@/components/ui/Badge';
import { getSettings, updateSettings } from '@/lib/api';
import { Settings, Save, CheckCircle, MapPin, Phone, Mail, Building, Globe } from 'lucide-react';

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data: initialSettings, isLoading } = useQuery({
    queryKey: ['admin-platform-settings'],
    queryFn: () => getSettings().catch(() => null),
  });

  const [formData, setFormData] = useState({
    platformName: 'Apex Engineering Academy',
    contactEmail: 'admissions@apexengineering.edu',
    contactPhone: '+91 (020) 2553-9000',
    whatsappNumber: '+91 98230 12345',
    centerAddress: '3rd Floor, Apex Tech Tower, Opp. Ferguson College Main Gate, FC Road, Shivajinagar, Pune - 411005',
    admissionsOpen: true,
    maintenanceMode: false,
    curriculumRevisionYear: '2019 / 2024 Pattern (SPPU)',
  });

  useEffect(() => {
    if (initialSettings) {
      setFormData((prev) => ({
        ...prev,
        ...initialSettings,
      }));
    }
  }, [initialSettings]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-platform-settings'] });
      setSuccessMessage('Platform settings successfully saved and deployed!');
      setTimeout(() => setSuccessMessage(null), 3500);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-main)]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="primary">Configuration</Badge>
            </div>
            <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
              Platform & Offline Center Settings
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              Global system configuration, physical learning center contact details, and admissions broadcast switches.
            </p>
          </div>

          {successMessage && (
            <div className="p-4 rounded-2xl bg-success-light border border-success/20 text-success text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] max-w-3xl space-y-6">
            <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Building className="w-4 h-4 text-primary" /> Offline Learning Center Pune Info
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Academy Brand Name</label>
                <input
                  type="text"
                  name="platformName"
                  value={formData.platformName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Curriculum Standard</label>
                <input
                  type="text"
                  name="curriculumRevisionYear"
                  value={formData.curriculumRevisionYear}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Admissions Hotline (Phone)</label>
                <input
                  type="text"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">WhatsApp Helpline</label>
                <input
                  type="text"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Support Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Physical Center Address</label>
              <textarea
                name="centerAddress"
                rows={2}
                value={formData.centerAddress}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-[var(--text-primary)]">Classroom Admissions Open</span>
                  <p className="text-[11px] text-[var(--text-muted)]">Display admission inquiry badges & demo booking prompts across public site</p>
                </div>
                <input
                  type="checkbox"
                  name="admissionsOpen"
                  checked={formData.admissionsOpen}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-primary border-[var(--border)]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-6 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-hover)] transition-colors shadow-md shadow-primary/20 flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{updateMutation.isPending ? 'Saving...' : 'Save Configuration'}</span>
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
