'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  GraduationCap,
  FolderTree,
  BookOpen,
  FileText,
  Video,
  ListVideo,
  Code,
  Briefcase,
  Compass,
  Calendar,
  Bell,
  Users,
  Image,
  BarChart3,
  ShieldAlert,
  Settings,
  ChevronDown,
  ChevronRight,
  Layers,
  Sparkles,
} from 'lucide-react';

interface NavItem {
  title: string;
  href?: string;
  icon: any;
  children?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Academic Hierarchy',
    icon: FolderTree,
    children: [
      { title: 'Academic Years', href: '/academic/years' },
      { title: 'Branches & Depts', href: '/academic/branches' },
      { title: 'Semesters', href: '/academic/semesters' },
      { title: 'Subjects & Units', href: '/academic/subjects' },
    ],
  },
  {
    title: 'Resources',
    icon: BookOpen,
    children: [
      { title: 'PYQ Bank', href: '/resources/pyqs' },
      { title: 'Handwritten Notes', href: '/resources/notes' },
      { title: 'Video Lectures', href: '/resources/videos' },
      { title: 'Playlists', href: '/resources/playlists' },
      { title: 'Capstone Projects', href: '/resources/projects' },
    ],
  },
  {
    title: 'Careers & Guidance',
    icon: Briefcase,
    children: [
      { title: 'Job Board & Drives', href: '/careers/jobs' },
      { title: 'Career Roadmaps', href: '/careers/guidance' },
    ],
  },
  {
    title: 'Classroom Courses',
    href: '/courses',
    icon: GraduationCap,
  },
  {
    title: 'Faculty & Mentors',
    href: '/faculty',
    icon: Users,
  },
  {
    title: 'Leads & Admissions CRM',
    href: '/leads',
    icon: Sparkles,
  },
  {
    title: 'Events & Workshops',
    href: '/events',
    icon: Calendar,
  },
  {
    title: 'Announcements & Alerts',
    href: '/announcements',
    icon: Bell,
  },
  {
    title: 'Cloudinary Media',
    href: '/media',
    icon: Image,
  },
  {
    title: 'Analytics & Events',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    title: 'Security & Audit Logs',
    href: '/audit-logs',
    icon: ShieldAlert,
  },
  {
    title: 'Platform Settings',
    href: '/settings',
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'Academic Hierarchy': true,
    'Resources': true,
    'Careers & Guidance': false,
  });

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside className="w-64 bg-[var(--surface)] border-r border-[var(--border)] flex flex-col h-screen shrink-0 sticky top-0">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-[var(--border)] flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center font-black text-white text-sm shadow-md shadow-primary/20">
          A
        </div>
        <div>
          <span className="font-bold text-sm text-[var(--text-primary)] tracking-tight block">
            Apex Admin
          </span>
          <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider block">
            Control Center v1.0
          </span>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const hasChildren = item.children && item.children.length > 0;
          const isOpen = openSections[item.title];
          const isDirectActive = item.href && pathname === item.href;
          const isChildActive =
            hasChildren && item.children?.some((c) => pathname.startsWith(c.href));

          if (!hasChildren) {
            return (
              <Link
                key={item.title}
                href={item.href!}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isDirectActive
                    ? 'bg-[var(--primary)] text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.title}</span>
              </Link>
            );
          }

          return (
            <div key={item.title} className="space-y-1">
              <button
                type="button"
                onClick={() => toggleSection(item.title)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isChildActive
                    ? 'text-[var(--primary)] bg-[var(--primary-light)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.title}</span>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                )}
              </button>

              {isOpen && (
                <div className="pl-9 pr-2 space-y-1 pt-0.5">
                  {item.children?.map((child) => {
                    const isSubActive = pathname === child.href;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block px-3 py-1.5 rounded-lg text-xs transition-colors ${
                          isSubActive
                            ? 'font-bold text-[var(--primary)] bg-[var(--surface-elevated)]'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]/50'
                        }`}
                      >
                        {child.title}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-[var(--border)] bg-[var(--bg-main)]/50">
        <div className="p-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
            <span className="text-[11px] text-[var(--text-secondary)] font-medium">
              API Online • v1
            </span>
          </div>
          <span className="text-[10px] text-[var(--text-muted)] font-mono">Port 5000</span>
        </div>
      </div>
    </aside>
  );
}
