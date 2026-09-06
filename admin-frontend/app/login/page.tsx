'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { Lock, Mail, ShieldAlert, ArrowRight, Sparkles, KeyRound } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('admin@engineering.edu');
  const [password, setPassword] = useState('Admin@12345');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Please provide both admin email and password.');
      return;
    }

    const success = await login(email, password);
    if (success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[var(--primary)]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Card */}
        <div className="p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[var(--primary)] text-white flex items-center justify-center font-black text-xl mx-auto shadow-lg shadow-primary/25">
              A
            </div>
            <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
              Apex Admin Portal
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              Authorized personnel & faculty control center
            </p>
          </div>

          {(error || localError) && (
            <div className="p-3 rounded-xl bg-danger-light border border-danger/20 text-danger text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error || localError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@engineering.edu"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                Master Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-bold text-xs hover:bg-[var(--primary-hover)] transition-colors shadow-lg shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying Session...' : 'Authenticate & Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Reminder */}
          <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-primary font-semibold text-[11px]">
              <KeyRound className="w-3.5 h-3.5" /> Seed Admin Credentials:
            </div>
            <p className="text-[11px] text-[var(--text-muted)] font-mono">
              Email: <span className="text-[var(--text-primary)]">admin@engineering.edu</span>
            </p>
            <p className="text-[11px] text-[var(--text-muted)] font-mono">
              Password: <span className="text-[var(--text-primary)]">Admin@12345</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
