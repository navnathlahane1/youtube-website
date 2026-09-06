'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, ReactNode, useEffect } from 'react';
import { useBookmarksStore } from '@/lib/store/bookmarks-store';

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  const initBookmarks = useBookmarksStore((s) => s.init);

  useEffect(() => {
    initBookmarks();
  }, [initBookmarks]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
