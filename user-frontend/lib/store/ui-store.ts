import { create } from 'zustand';

interface UIState {
  isSearchModalOpen: boolean;
  openSearchModal: () => void;
  closeSearchModal: () => void;
  toggleSearchModal: () => void;

  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;

  isFilterSheetOpen: boolean;
  setFilterSheetOpen: (open: boolean) => void;

  activeAcademicYearId?: string;
  setActiveAcademicYearId: (id?: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSearchModalOpen: false,
  openSearchModal: () => set({ isSearchModalOpen: true }),
  closeSearchModal: () => set({ isSearchModalOpen: false }),
  toggleSearchModal: () => set((state) => ({ isSearchModalOpen: !state.isSearchModalOpen })),

  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  isFilterSheetOpen: false,
  setFilterSheetOpen: (open) => set({ isFilterSheetOpen: open }),

  activeAcademicYearId: undefined,
  setActiveAcademicYearId: (id) => set({ activeAcademicYearId: id }),
}));
