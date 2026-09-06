'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Bookmark,
  ChevronDown,
  Menu,
  X,
  GraduationCap,
  Sparkles,
  BookOpen,
  FileText,
  Video,
  FolderGit2,
  Briefcase,
  Compass,
  Building2,
  PhoneCall,
} from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';
import { useBookmarksStore } from '@/lib/store/bookmarks-store';
import { Button } from '@/components/ui/Button';

export function Header() {
  const pathname = usePathname();
  const openSearchModal = useUIStore((s) => s.openSearchModal);
  const { isMobileMenuOpen, toggleMobileMenu, setMobileMenuOpen } = useUIStore();
  const bookmarksCount = useBookmarksStore((s) => s.bookmarks.length);
  const [isAcademicDropdownOpen, setIsAcademicDropdownOpen] = useState(false);

  const branches = [
    { name: 'Computer Science & Engineering', code: 'CSE', href: '/academics/cse/5' },
    { name: 'Information Technology', code: 'IT', href: '/academics/it/5' },
    { name: 'Artificial Intelligence & Data Science', code: 'AIDS', href: '/academics/aids/5' },
    { name: 'Electronics & Telecommunication', code: 'ETC', href: '/academics/etc/5' },
    { name: 'Mechanical Engineering', code: 'MECH', href: '/academics/mech/5' },
    { name: 'Civil Engineering', code: 'CIVIL', href: '/academics/civil/5' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Apex<span className="text-blue-600">Engineering</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-400 text-slate-950">
                  Offline Hub
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 font-medium tracking-wide">
                Academy & Digital Academic Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* Academics Mega-menu Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsAcademicDropdownOpen(true)}
              onMouseLeave={() => setIsAcademicDropdownOpen(false)}
            >
              <Link
                href="/academics"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith('/academics')
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40'
                    : 'text-slate-700 dark:text-slate-200 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                Academics <ChevronDown className="w-3.5 h-3.5" />
              </Link>

              {/* Dropdown Menu */}
              {isAcademicDropdownOpen && (
                <div className="absolute top-full left-0 w-80 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Engineering Branches
                  </div>
                  <div className="space-y-1">
                    {branches.map((b) => (
                      <Link
                        key={b.code}
                        href={b.href}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600">
                            {b.name}
                          </p>
                          <p className="text-xs text-slate-400">Semester 1 to 8 Syllabi & Notes</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-blue-500">
                          {b.code}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Link
                      href="/academics"
                      className="block text-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline py-1"
                    >
                      View All Branches & Semesters →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Resources Hub */}
            <Link
              href="/resources"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/resources' || pathname.startsWith('/pyqs') || pathname.startsWith('/notes')
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40'
                  : 'text-slate-700 dark:text-slate-200 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              Resources
            </Link>

            {/* Offline Courses & Batches */}
            <Link
              href="/courses"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                pathname.startsWith('/courses')
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40'
                  : 'text-slate-700 dark:text-slate-200 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Offline Batches
            </Link>

            {/* Careers */}
            <Link
              href="/careers"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith('/careers')
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40'
                  : 'text-slate-700 dark:text-slate-200 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              Jobs & Roadmaps
            </Link>

            {/* Faculty */}
            <Link
              href="/faculty"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/faculty'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40'
                  : 'text-slate-700 dark:text-slate-200 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              Faculty
            </Link>
          </nav>

          {/* Search Trigger Button & Actions */}
          <div className="flex items-center gap-2.5">
            {/* Search Button */}
            <button
              onClick={openSearchModal}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/80 transition-all text-xs sm:text-sm cursor-pointer"
              aria-label="Universal Search"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span className="hidden md:inline-block">Search resources...</span>
              <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded">
                ⌘K
              </kbd>
            </button>

            {/* Bookmarks Counter */}
            <Link
              href="/bookmarks"
              className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
              title="Saved Resources"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarksCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {bookmarksCount}
                </span>
              )}
            </Link>

            {/* Offline Demo CTA */}
            <Link href="/contact" className="hidden sm:inline-block">
              <Button size="sm" variant="accent" className="font-bold shadow-md shadow-amber-500/20">
                Book Free Demo Class
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3 animate-in slide-in-from-top-4 duration-150">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link
              href="/academics"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-medium"
            >
              <BookOpen className="w-4 h-4 text-blue-500" /> Academics Hub
            </Link>
            <Link
              href="/resources"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-medium"
            >
              <FileText className="w-4 h-4 text-amber-500" /> All Resources
            </Link>
            <Link
              href="/pyqs"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-medium"
            >
              <FileText className="w-4 h-4 text-blue-500" /> PYQ Exam Papers
            </Link>
            <Link
              href="/notes"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-medium"
            >
              <BookOpen className="w-4 h-4 text-emerald-500" /> Lecture Notes
            </Link>
            <Link
              href="/videos"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-medium"
            >
              <Video className="w-4 h-4 text-rose-500" /> Video Tutorials
            </Link>
            <Link
              href="/projects"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-medium"
            >
              <FolderGit2 className="w-4 h-4 text-cyan-500" /> Final Projects
            </Link>
            <Link
              href="/careers"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-medium"
            >
              <Briefcase className="w-4 h-4 text-purple-500" /> Jobs & Drives
            </Link>
            <Link
              href="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold"
            >
              <Sparkles className="w-4 h-4 text-amber-500" /> Offline Batches
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full font-bold" variant="accent">
                Book Free Demo Class at Offline Center
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
