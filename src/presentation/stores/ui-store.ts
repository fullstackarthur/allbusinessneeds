import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UiState {
  sidebarOpen: boolean
  searchOpen: boolean
  mobileNavVisible: boolean
  showPrices: boolean

  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setSearchOpen: (open: boolean) => void
  toggleSearch: () => void
  setMobileNavVisible: (visible: boolean) => void
  setShowPrices: (show: boolean) => void
  togglePrices: () => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarOpen: false,
      searchOpen: false,
      mobileNavVisible: true,
      showPrices: false,

      setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSearchOpen: (open: boolean) => set({ searchOpen: open }),
      toggleSearch: () => set((state) => ({ searchOpen: !state.searchOpen })),
      setMobileNavVisible: (visible: boolean) => set({ mobileNavVisible: visible }),
      setShowPrices: (show: boolean) => set({ showPrices: show }),
      togglePrices: () => set((state) => ({ showPrices: !state.showPrices })),
    }),
    {
      name: 'abn_ui_settings',
      partialize: (state) => ({ showPrices: state.showPrices }),
    },
  ),
)
