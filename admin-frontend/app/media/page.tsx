'use client';

import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { Badge } from '@/components/ui/Badge';
import { getMediaAssets, uploadFileDirect, deleteAsset } from '@/lib/api';
import {
  Image as ImageIcon,
  FileText,
  UploadCloud,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Plus,
  Loader2,
  Trash2,
} from 'lucide-react';

export default function AdminMediaPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { data: mediaRes, isLoading } = useQuery({
    queryKey: ['admin-media-assets'],
    queryFn: () => getMediaAssets().catch(() => ({ items: [] })),
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadFileDirect(file, 'engineering_portal'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-media-assets'] });
      setUploadError(null);
    },
    onError: (err: any) => {
      setUploadError(err.message || 'Failed to upload media to Cloudinary');
    },
  });

  const mediaList = mediaRes?.items || [];

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-main)]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="primary">Cloudinary Media CDN</Badge>
              </div>
              <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
                Media Library & System File Uploads
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                Directly upload engineering PDFs, lecture slides, and images from your device straight to Cloudinary.
              </p>
            </div>

            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,.zip"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadMutation.isPending}
                className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-hover)] transition-colors shadow-md shadow-primary/20 flex items-center gap-1.5 disabled:opacity-50"
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Uploading to Cloudinary...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Upload File from Device
                  </>
                )}
              </button>
            </div>
          </div>

          {uploadError && (
            <div className="p-3.5 rounded-xl bg-danger-light border border-danger/30 text-danger text-xs">
              {uploadError}
            </div>
          )}

          {/* Upload Security Protocol Banner */}
          <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-success shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-[var(--text-primary)]">
                Secure Cloudinary Storage Active
              </span>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Cloud Name: <code className="text-primary font-mono font-bold">whvutqg9</code>. All uploaded files are permanently hosted on Cloudinary and automatically synchronized with the database asset catalog.
              </p>
            </div>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mediaList.map((asset: any) => (
              <div
                key={asset._id}
                className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-primary/40 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="h-28 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-center mb-3">
                    {asset.resourceType === 'image' || ['png', 'jpg', 'jpeg', 'webp'].includes(asset.format?.toLowerCase()) ? (
                      <ImageIcon className="w-8 h-8 text-primary" />
                    ) : (
                      <FileText className="w-8 h-8 text-warning" />
                    )}
                  </div>
                  <h4 className="font-bold text-xs text-[var(--text-primary)] truncate" title={asset.originalFilename}>
                    {asset.originalFilename || 'Cloudinary File'}
                  </h4>
                  <p className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">
                    {asset.format?.toUpperCase() || 'PDF'} • {((asset.bytes || 102400) / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2 mt-3">
                  <button
                    onClick={() => copyToClipboard(asset.secureUrl || asset.url, asset._id)}
                    className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    {copiedId === asset._id ? (
                      <>
                        <Check className="w-3 h-3 text-success" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy URL
                      </>
                    )}
                  </button>
                  <a
                    href={asset.secureUrl || asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}

            {mediaList.length === 0 && !isLoading && (
              <div className="col-span-full py-16 text-center text-xs text-[var(--text-muted)] bg-[var(--surface)]/50 rounded-2xl border border-dashed border-[var(--border)]">
                <UploadCloud className="w-10 h-10 mx-auto text-[var(--text-muted)]/40 mb-2" />
                <p>No Cloudinary assets uploaded yet. Click &quot;Upload File from Device&quot; to upload your first study material!</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
