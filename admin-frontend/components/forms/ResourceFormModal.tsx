'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Save,
  Layers,
  FileText,
  Globe,
  UploadCloud,
  CheckCircle,
  Loader2,
  ExternalLink,
  Check,
  AlertCircle,
  FileCheck,
  RefreshCw,
} from 'lucide-react';
import { getBranches, getSemesters, getSubjects, uploadFileDirect } from '@/lib/api';

interface ResourceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  resourceType: 'pyq' | 'note' | 'video' | 'project' | 'job' | 'course';
  title: string;
}

export function ResourceFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  resourceType,
  title,
}: ResourceFormModalProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'academic' | 'content' | 'seo' | 'publish'>('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // File upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadedFileInfo, setUploadedFileInfo] = useState<{
    name: string;
    size: number;
    url: string;
    format?: string;
  } | null>(null);

  // Form states
  const [formData, setFormData] = useState<any>({
    title: '',
    slug: '',
    description: '',
    branchId: '',
    semesterId: '',
    subjectId: '',
    academicYearId: '',
    examYear: 2024,
    examType: 'END_SEM',
    difficulty: 'MEDIUM',
    isHandwritten: true,
    fileUrl: '',
    fileSizeBytes: 0,
    videoUrl: '',
    duration: '',
    githubUrl: '',
    liveUrl: '',
    seoTitle: '',
    seoDescription: '',
    keywords: '',
    status: 'PUBLISHED',
    ...initialData,
  });

  // Dropdown data
  const [branches, setBranches] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      getBranches().then((b) => {
        setBranches(b);
        if (b && b.length > 0 && !initialData?.branchId) {
          setFormData((prev: any) => ({ ...prev, branchId: prev.branchId || b[0]._id }));
        }
      }).catch(() => {});

      getSemesters().then((s) => {
        setSemesters(s);
        if (s && s.length > 0 && !initialData?.semesterId) {
          setFormData((prev: any) => ({ ...prev, semesterId: prev.semesterId || s[0]._id }));
        }
      }).catch(() => {});

      getSubjects().then((sub) => {
        setSubjects(sub);
        if (sub && sub.length > 0 && !initialData?.subjectId) {
          setFormData((prev: any) => ({ ...prev, subjectId: prev.subjectId || sub[0]._id }));
        }
      }).catch(() => {});

      if (initialData) {
        setFormData({ ...initialData });
        if (initialData.fileUrl) {
          setUploadedFileInfo({
            name: initialData.title || 'Existing Cloudinary Asset',
            size: initialData.fileSizeBytes || 0,
            url: initialData.fileUrl,
          });
        }
      } else {
        setUploadedFileInfo(null);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev: any) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev: any) => {
        const next = { ...prev, [name]: value };
        if (name === 'title' && !initialData) {
          next.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        return next;
      });
    }
  };

  const handleSystemFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFile(true);
    setError(null);

    try {
      // Direct upload to backend which streams to Cloudinary and registers in DB
      const result = await uploadFileDirect(file, 'engineering_portal');
      const secureUrl = result.secureUrl || result.url;

      if (!secureUrl) {
        throw new Error('Cloudinary did not return a secure file URL');
      }

      setFormData((prev: any) => {
        const updated = {
          ...prev,
          fileUrl: secureUrl,
          fileSizeBytes: result.bytes || file.size,
        };
        // Auto-fill title if empty
        if (!prev.title) {
          const autoTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
          updated.title = autoTitle;
          updated.slug = autoTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        return updated;
      });

      setUploadedFileInfo({
        name: file.name,
        size: file.size,
        url: secureUrl,
        format: result.format || file.name.split('.').pop(),
      });
    } catch (err: any) {
      setError(`Upload failed: ${err.message || 'Could not upload file to Cloudinary'}`);
    } finally {
      setIsUploadingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate Academic requirements for note & pyq
    if (['note', 'pyq'].includes(resourceType)) {
      if (!formData.branchId || formData.branchId === '') {
        setError('Please select an Engineering Branch under "2. Academic Classification" tab.');
        setActiveTab('academic');
        setIsSubmitting(false);
        return;
      }
      if (!formData.semesterId || formData.semesterId === '') {
        setError('Please select a Semester under "2. Academic Classification" tab.');
        setActiveTab('academic');
        setIsSubmitting(false);
        return;
      }
      if (!formData.subjectId || formData.subjectId === '') {
        setError('Please select a Subject under "2. Academic Classification" tab.');
        setActiveTab('academic');
        setIsSubmitting(false);
        return;
      }
      if (!formData.fileUrl || formData.fileUrl.trim() === '') {
        setError('Please upload a PDF document from your system or enter a valid file URL under "3. Content & Files" tab.');
        setActiveTab('content');
        setIsSubmitting(false);
        return;
      }
    }

    // Clean payload of empty strings
    const sanitizedPayload: any = { ...formData };
    Object.keys(sanitizedPayload).forEach((key) => {
      if (sanitizedPayload[key] === '') {
        delete sanitizedPayload[key];
      }
    });

    try {
      await onSubmit(sanitizedPayload);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save resource');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'basic', label: '1. Basic Info', icon: FileText },
    { id: 'academic', label: '2. Academic Classification', icon: Layers },
    { id: 'content', label: '3. Content & Files', icon: UploadCloud },
    { id: 'seo', label: '4. SEO Metadata', icon: Globe },
    { id: 'publish', label: '5. Publishing Status', icon: CheckCircle },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-3xl rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface-elevated)]">
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)]">{title}</h2>
            <span className="text-[11px] text-[var(--text-muted)] font-mono uppercase tracking-wider">
              {resourceType.toUpperCase()} Creator / Editor
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[var(--border)] bg-[var(--surface-elevated)]/50 overflow-x-auto scrollbar-none px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--surface)]'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-danger-light border border-danger/30 text-danger text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title || ''}
                  onChange={handleChange}
                  placeholder="e.g. SPPU 2023 End-Sem DBMS Question Paper & Solutions"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  name="slug"
                  required
                  value={formData.slug || ''}
                  onChange={handleChange}
                  placeholder="e.g. sppu-2023-dbms-pyq-solutions"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Description / Synopsis
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description || ''}
                  onChange={handleChange}
                  placeholder="Comprehensive summary of topics covered in this resource..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: ACADEMIC CLASSIFICATION */}
          {activeTab === 'academic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                    Branch *
                  </label>
                  <select
                    name="branchId"
                    value={formData.branchId || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                  >
                    <option value="">Select Branch</option>
                    {branches.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name} ({b.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                    Semester *
                  </label>
                  <select
                    name="semesterId"
                    value={formData.semesterId || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                  >
                    <option value="">Select Semester</option>
                    {semesters.map((s) => (
                      <option key={s._id} value={s._id}>
                        Semester {s.number}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Subject *
                </label>
                <select
                  name="subjectId"
                  value={formData.subjectId || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                >
                  <option value="">Select Subject</option>
                  {subjects.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name} ({sub.code})
                    </option>
                  ))}
                </select>
              </div>

              {resourceType === 'pyq' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                      Exam Year
                    </label>
                    <input
                      type="number"
                      name="examYear"
                      value={formData.examYear || 2024}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                      Exam Type
                    </label>
                    <select
                      name="examType"
                      value={formData.examType || 'END_SEM'}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                    >
                      <option value="IN_SEM">In-Sem (30 Marks)</option>
                      <option value="END_SEM">End-Sem (70 Marks)</option>
                      <option value="SUPPLEMENTARY">Supplementary</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CONTENT & FILES */}
          {activeTab === 'content' && (
            <div className="space-y-5">
              {/* DIRECT SYSTEM FILE UPLOADER */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-primary)] flex items-center justify-between">
                  <span>Upload File from Device (Cloudinary Direct Storage)</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-normal">PDF, DOCX, Images, ZIP up to 50MB</span>
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleSystemFileUpload}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,.zip"
                  className="hidden"
                />

                <div
                  onClick={() => !isUploadingFile && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
                    isUploadingFile
                      ? 'border-primary/50 bg-primary-light/30 pointer-events-none'
                      : uploadedFileInfo
                      ? 'border-success/40 bg-success-light/20 hover:border-success/60'
                      : 'border-[var(--border)] bg-[var(--surface-elevated)] hover:border-primary hover:bg-[var(--surface-elevated)]/80'
                  }`}
                >
                  {isUploadingFile ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-3">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      <span className="font-bold text-xs text-primary">Uploading to Cloudinary...</span>
                      <p className="text-[11px] text-[var(--text-muted)]">Streaming bytes securely with Cloudinary Media SDK</p>
                    </div>
                  ) : uploadedFileInfo ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-1">
                      <div className="w-10 h-10 rounded-full bg-success/20 text-success flex items-center justify-center">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-xs text-text-primary">{uploadedFileInfo.name}</span>
                      <p className="text-[11px] text-success font-mono">
                        ✓ Stored in Cloudinary ({((uploadedFileInfo.size || 1024) / 1024 / 1024).toFixed(2)} MB)
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <a
                          href={uploadedFileInfo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1 rounded-lg bg-[var(--surface)] text-[11px] text-primary font-semibold hover:underline border border-[var(--border)] inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" /> View Uploaded File
                        </a>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="px-3 py-1 rounded-lg bg-[var(--surface)] text-[11px] text-[var(--text-secondary)] font-semibold hover:text-text-primary border border-[var(--border)] inline-flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" /> Replace File
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 py-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-text-primary block">
                          Click to browse and upload file from your computer
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)] block mt-0.5">
                          File will be automatically uploaded to Cloudinary & registered in database
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* MANUAL URL INPUT */}
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Document / PDF URL (Auto-filled on upload) *
                </label>
                <input
                  type="url"
                  name="fileUrl"
                  value={formData.fileUrl || ''}
                  onChange={handleChange}
                  placeholder="https://res.cloudinary.com/.../document.pdf"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              {resourceType === 'video' && (
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                    YouTube Video URL / Embed Link
                  </label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl || ''}
                    onChange={handleChange}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
              )}

              {resourceType === 'project' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                      GitHub Repo URL
                    </label>
                    <input
                      type="url"
                      name="githubUrl"
                      value={formData.githubUrl || ''}
                      onChange={handleChange}
                      placeholder="https://github.com/..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                      Live Project Demo URL
                    </label>
                    <input
                      type="url"
                      name="liveUrl"
                      value={formData.liveUrl || ''}
                      onChange={handleChange}
                      placeholder="https://project-demo.com"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SEO METADATA */}
          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Meta Title Tag
                </label>
                <input
                  type="text"
                  name="seoTitle"
                  value={formData.seoTitle || ''}
                  onChange={handleChange}
                  placeholder="e.g. SPPU 2023 DBMS Question Papers with Full Step Solutions"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Meta Description
                </label>
                <textarea
                  name="seoDescription"
                  rows={3}
                  value={formData.seoDescription || ''}
                  onChange={handleChange}
                  placeholder="Target search snippets for Google, Bing and social link unfurls..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords || ''}
                  onChange={handleChange}
                  placeholder="sppu, dbms pyqs, engineering notes, 5th sem computer"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>
          )}

          {/* TAB 5: PUBLISHING STATUS */}
          {activeTab === 'publish' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Publishing Lifecycle State
                </label>
                <select
                  name="status"
                  value={formData.status || 'PUBLISHED'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                >
                  <option value="DRAFT">DRAFT (Hidden from students)</option>
                  <option value="IN_REVIEW">IN REVIEW (Awaiting senior verification)</option>
                  <option value="APPROVED">APPROVED (Ready for deployment)</option>
                  <option value="PUBLISHED">PUBLISHED (Live on Public Portal)</option>
                  <option value="ARCHIVED">ARCHIVED (De-indexed)</option>
                </select>
              </div>

              <div className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--text-muted)] space-y-2">
                <p className="font-semibold text-[var(--text-primary)]">Publishing Checklist:</p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-success" />
                  <span>Title & Slug are URL-safe and unique</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-success" />
                  <span>Cloudinary media PDF / URL validated</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-success" />
                  <span>Audit trail logs will record current admin actor</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploadingFile}
              className="px-6 py-2 text-xs font-bold rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors flex items-center gap-1.5 shadow-md shadow-primary/20 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Saving...' : 'Save & Commit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
