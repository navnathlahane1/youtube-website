import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/components/providers/QueryProvider';
import AuthGuard from '@/components/auth/AuthGuard';

export const metadata: Metadata = {
  title: 'Apex Engineering Admin Portal',
  description: 'Production-grade content management, telemetry analytics, academic hierarchy and leads CRM control center.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] antialiased font-sans">
        <QueryProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
        </QueryProvider>
      </body>
    </html>
  );
}
