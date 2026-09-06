import { create } from 'zustand';

export interface BookmarkedItem {
  id: string;
  type: 'pyq' | 'note' | 'video' | 'project' | 'job' | 'career';
  title: string;
  slug: string;
  url: string;
  subtitle?: string;
  badge?: string;
  savedAt: number;
}

interface BookmarksState {
  bookmarks: BookmarkedItem[];
  isHydrated: boolean;
  toggleBookmark: (item: Omit<BookmarkedItem, 'savedAt'>) => void;
  isBookmarked: (id: string) => boolean;
  removeBookmark: (id: string) => void;
  clearAll: () => void;
  init: () => void;
}

const STORAGE_KEY = 'apex_engineering_bookmarks_v1';

export const useBookmarksStore = create<BookmarksState>((set, get) => ({
  bookmarks: [],
  isHydrated: false,

  init: () => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        set({ bookmarks: JSON.parse(raw), isHydrated: true });
      } else {
        set({ isHydrated: true });
      }
    } catch {
      set({ isHydrated: true });
    }
  },

  toggleBookmark: (item) => {
    const { bookmarks } = get();
    const exists = bookmarks.some((b) => b.id === item.id);
    let updated: BookmarkedItem[];

    if (exists) {
      updated = bookmarks.filter((b) => b.id !== item.id);
    } else {
      updated = [{ ...item, savedAt: Date.now() }, ...bookmarks];
    }

    set({ bookmarks: updated });
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  },

  isBookmarked: (id: string) => {
    return get().bookmarks.some((b) => b.id === id);
  },

  removeBookmark: (id: string) => {
    const updated = get().bookmarks.filter((b) => b.id !== id);
    set({ bookmarks: updated });
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  },

  clearAll: () => {
    set({ bookmarks: [] });
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  },
}));
