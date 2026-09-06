import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { TopBanner } from '@/components/layout/TopBanner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { UniversalSearchModal } from '@/components/search/UniversalSearchModal';

export const metadata: Metadata = {
  metadataBase: new URL('https://apexengineering.edu'),
  title: {
    default: 'Apex Engineering Academy | Offline Coaching & Engineering Resource Vault',
    template: '%s | Apex Engineering Academy',
  },
  description:
    'Pune’s premier offline engineering classroom coaching center. Free solved university PYQs, toppers handwritten notes, video lectures, and placement guidance for CSE, IT, AI&DS, E&TC, Mechanical, and Civil engineers.',
  keywords: [
    'engineering notes',
    'solved pyq papers',
    'engineering mathematics notes',
    'dbms question paper solutions',
    'offline engineering coaching pune',
    'gate 2026 coaching',
    'engineering syllabus breakdown',
  ],
  authors: [{ name: 'Apex Engineering Academic Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://apexengineering.edu',
    siteName: 'Apex Engineering Academy',
    title: 'Apex Engineering Academy | Offline Coaching & Resource Hub',
    description: 'Master your engineering degree with expert offline classroom coaching and download free solved PYQs and handwritten notes.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Apex Engineering Academy Campus',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apex Engineering Academy & Resource Vault',
    description: 'Premier offline classroom coaching & free digital study materials for engineering students.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Apex Engineering Academy',
    url: 'https://apexengineering.edu',
    logo: 'https://apexengineering.edu/logo.png',
    description: 'Premier offline classroom coaching and digital resource vault for engineering degree students in Pune.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Plot 42, Education Hub, Tech Park Boulevard',
      addressLocality: 'Pune',
      addressRegion: 'Maharashtra',
      postalCode: '411001',
      addressCountry: 'IN',
    },
    telephone: '+919876543210',
    sameAs: ['https://youtube.com/@apexengineering', 'https://linkedin.com/company/apexengineering'],
  };

  return (
    <html lang="en" className="scroll-smooth dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16 lg:pb-0">
        <QueryProvider>
          <TopBanner />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileNav />
          <UniversalSearchModal />
        </QueryProvider>
      </body>
    </html>
  );
}
