'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, FileText, Sparkles, Bookmark } from 'lucide-react';
import { useBookmarksStore } from '@/lib/store/bookmarks-store';

export function MobileNav() {
  const pathname = usePathname();
  const bookmarksCount = useBookmarksStore((s) => s.bookmarks.length);

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Academics', href: '/academics', icon: BookOpen },
    { label: 'Resources', href: '/resources', icon: FileText },
    { label: 'Offline Batches', href: '/courses', icon: Sparkles, highlight: true },
    { label: 'Saved', href: '/bookmarks', icon: Bookmark, badge: bookmarksCount },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around shadow-2xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`relative flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all ${
              item.highlight
                ? 'text-amber-500 font-bold'
                : isActive
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${item.highlight ? 'fill-amber-500/20 text-amber-500' : ''}`} />
              {item.badge && item.badge > 0 ? (
                <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 bg-blue-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
