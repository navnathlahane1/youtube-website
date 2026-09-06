'use client';

import { useAuthStore } from '@/lib/store/auth-store';
import { Badge } from '@/components/ui/Badge';
import { LogOut, ExternalLink, ShieldCheck, User, Search } from 'lucide-react';
import Link from 'next/link';

export default function AdminHeader() {
  const { admin, logout } = useAuthStore();

  const handleLogout = async () => {
    if (confirm('Are you sure you want to sign out of the Admin portal?')) {
      await logout();
      window.location.href = '/login';
    }
  };

  return (
    <header className="h-16 bg-[var(--surface)] border-b border-[var(--border)] px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search Bar */}
      <div className="relative w-80 max-w-sm hidden sm:block">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Quick search across modules..."
          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--primary)] px-3 py-1.5 rounded-xl hover:bg-[var(--surface-elevated)] transition-colors"
        >
          <span>Live Student Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <div className="h-5 w-[1px] bg-[var(--border)]" />

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--primary-light)] text-[var(--primary)] border border-primary/20 flex items-center justify-center font-bold text-xs">
            {admin?.name ? admin.name.slice(0, 2).toUpperCase() : <User className="w-4 h-4" />}
          </div>
          <div className="hidden md:block">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[var(--text-primary)]">{admin?.name || 'Super Admin'}</span>
              <Badge variant="primary" size="sm">{admin?.role || 'SUPER_ADMIN'}</Badge>
            </div>
            <span className="text-[10px] text-[var(--text-muted)] block">{admin?.email || 'admin@engineering.edu'}</span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          title="Sign Out"
          className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-light)] transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
