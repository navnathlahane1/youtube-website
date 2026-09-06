'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  FileText,
  BookOpen,
  Video,
  FolderGit2,
  Briefcase,
  Compass,
  GraduationCap,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';
import { searchUniversal } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';

export function UniversalSearchModal() {
  const { isSearchModalOpen, closeSearchModal } = useUIStore();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handle Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        useUIStore.getState().toggleSearchModal();
      }
      if (e.key === 'Escape' && isSearchModalOpen) {
        closeSearchModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, closeSearchModal]);

  // Focus input when opened
  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isSearchModalOpen]);

  // Live search debounce
  useEffect(() => {
    if (!isSearchModalOpen) return;
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await searchUniversal({
          q: query,
          type: activeTab,
          limit: 12,
        });
        setResults(res?.items || []);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, activeTab, isSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const getIconForType = (type: string) => {
    switch (type) {
      case 'pyq':
        return <FileText className="w-4 h-4 text-amber-500" />;
      case 'note':
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'video':
        return <Video className="w-4 h-4 text-rose-500" />;
      case 'project':
        return <FolderGit2 className="w-4 h-4 text-emerald-500" />;
      case 'job':
        return <Briefcase className="w-4 h-4 text-purple-500" />;
      case 'career':
        return <Compass className="w-4 h-4 text-cyan-500" />;
      case 'course':
        return <GraduationCap className="w-4 h-4 text-indigo-500" />;
      default:
        return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleSelect = (url: string) => {
    closeSearchModal();
    router.push(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search engineering PYQs, notes, videos, projects, jobs, roadmaps..."
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-base focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/60 overflow-x-auto text-xs bg-slate-50/50 dark:bg-slate-900/50">
          {[
            { id: 'all', label: 'All Resources' },
            { id: 'pyq', label: 'PYQ Papers' },
            { id: 'note', label: 'Notes & Cheatsheets' },
            { id: 'video', label: 'Videos' },
            { id: 'project', label: 'Projects' },
            { id: 'job', label: 'Jobs & Drives' },
            { id: 'career', label: 'Roadmaps' },
            { id: 'course', label: 'Offline Batches' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors shrink-0 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Results Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 min-h-[220px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-xs">Searching resource repository...</p>
            </div>
          ) : results.length > 0 ? (
            results.map((item) => (
              <button
                key={`${item.type}-${item.id}`}
                onClick={() => handleSelect(item.url)}
                className="w-full text-left flex items-start gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors group cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors shrink-0 mt-0.5">
                  {getIconForType(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h4>
                    {item.badge && (
                      <Badge variant="primary" size="sm" className="shrink-0 text-[10px]">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  {item.subtitle && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0 self-center" />
              </button>
            ))
          ) : query ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
              <Search className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No matching resources found</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Try searching with broader terms like &quot;DBMS&quot;, &quot;Maths&quot;, &quot;Gate&quot;, or &quot;Full Stack&quot;.
              </p>
            </div>
          ) : (
            <div className="py-8 px-4 text-center">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Popular Searches
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {['DBMS Normalization PYQ', 'Engineering Mathematics 1', 'Theory of Computation', 'Computer Networks Subnetting', 'Full Stack Roadmap', 'GATE CS 2026'].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 dark:hover:text-blue-300 transition-colors"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between text-[11px] text-slate-500">
          <span>Search index powered by MongoDB Vector & Text Engine</span>
          <div className="flex items-center gap-3">
            <span>
              Press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">↑</kbd>{' '}
              <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">↓</kbd> to navigate
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
