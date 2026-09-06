'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useBookmarksStore, BookmarkedItem } from '@/lib/store/bookmarks-store';
import { Badge } from '@/components/ui/Badge';
import {
  Bookmark,
  Trash2,
  ExternalLink,
  BookOpen,
  FileText,
  Video,
  Code,
  Briefcase,
  Compass,
  ArrowRight,
} from 'lucide-react';

export default function BookmarksPage() {
  const { bookmarks, isHydrated, init, removeBookmark, clearAll } = useBookmarksStore();
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  useEffect(() => {
    init();
  }, [init]);

  const filteredBookmarks = bookmarks.filter((b) => {
    if (activeFilter === 'ALL') return true;
    return b.type.toUpperCase() === activeFilter;
  });

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pyq': return <FileText className="w-4 h-4 text-warning" />;
      case 'note': return <BookOpen className="w-4 h-4 text-primary" />;
      case 'video': return <Video className="w-4 h-4 text-danger" />;
      case 'project': return <Code className="w-4 h-4 text-accent" />;
      case 'job': return <Briefcase className="w-4 h-4 text-success" />;
      case 'career': return <Compass className="w-4 h-4 text-primary" />;
      default: return <FileText className="w-4 h-4 text-text-muted" />;
    }
  };

  return (
    <div className="min-h-screen py-10">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-text-muted mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text-primary">Saved Bookmarks</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Badge variant="primary" className="mb-2">
              <Bookmark className="w-3.5 h-3.5 mr-1" /> Offline / Local Storage
            </Badge>
            <h1 className="text-3xl md:text-4xl font-black text-text-primary font-display">
              Saved <span className="gradient-text">Engineering Resources</span>
            </h1>
            <p className="text-text-secondary text-xs md:text-sm mt-1">
              Instant offline-cached access to your bookmarked PYQs, handwritten notes, video lectures, and projects.
            </p>
          </div>

          {bookmarks.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to remove all saved bookmarks?')) {
                  clearAll();
                }
              }}
              className="px-4 py-2 rounded-xl bg-danger/10 hover:bg-danger/20 text-danger border border-danger/20 text-xs font-semibold transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All Bookmarks
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {['ALL', 'PYQ', 'NOTE', 'VIDEO', 'PROJECT', 'JOB', 'CAREER'].map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                activeFilter === type
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-surface text-text-secondary border-border hover:border-primary/40'
              }`}
            >
              {type === 'ALL' ? `All Items (${bookmarks.length})` : type}
            </button>
          ))}
        </div>

        {/* Bookmarks List */}
        {!isHydrated ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-surface border border-border animate-pulse" />
            ))}
          </div>
        ) : filteredBookmarks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBookmarks.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-surface border border-border hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-border flex items-center justify-center shrink-0">
                      {getIcon(item.type)}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                        {item.type} {item.badge && `• ${item.badge}`}
                      </span>
                      <h3 className="text-sm font-bold text-text-primary line-clamp-1">
                        {item.title}
                      </h3>
                      {item.subtitle && (
                        <p className="text-xs text-text-secondary line-clamp-1">{item.subtitle}</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => removeBookmark(item.id)}
                    title="Remove from saved"
                    className="text-text-muted hover:text-danger p-1 rounded-lg hover:bg-surface-elevated transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] text-text-muted">
                    Saved {new Date(item.savedAt).toLocaleDateString()}
                  </span>
                  <Link
                    href={item.url || `/${item.type}s/${item.slug}`}
                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span>Open Resource</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-text-muted bg-surface/50 rounded-3xl border border-dashed border-border max-w-lg mx-auto">
            <Bookmark className="w-12 h-12 mx-auto text-text-muted/40 mb-3" />
            <h3 className="font-bold text-text-primary text-base">No Saved Resources Yet</h3>
            <p className="text-xs mt-1 text-text-secondary max-w-xs mx-auto">
              Click the bookmark icon on any PYQ, handwritten note, or video lecture to save it for quick revision.
            </p>
            <Link
              href="/resources"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors shadow-sm"
            >
              <BookOpen className="w-4 h-4" /> Discover Engineering Resources
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
