'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && pathname !== '/login') {
        router.replace('/login');
      } else if (isAuthenticated && pathname === '/login') {
        router.replace('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading && pathname !== '/login') {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin mb-3" />
        <p className="text-xs text-[var(--text-muted)] tracking-wider uppercase font-mono">
          Verifying Admin Session...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
