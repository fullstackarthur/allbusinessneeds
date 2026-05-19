import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UiState {
  sidebarOpen: boolean
  searchOpen: boolean
  mobileNavVisible: boolean

  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setSearchOpen: (open: boolean) => void
  toggleSearch: () => void
  setMobileNavVisible: (visible: boolean) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarOpen: false,
      searchOpen: false,
      mobileNavVisible: true,

      setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSearchOpen: (open: boolean) => set({ searchOpen: open }),
      toggleSearch: () => set((state) => ({ searchOpen: !state.searchOpen })),
      setMobileNavVisible: (visible: boolean) => set({ mobileNavVisible: visible }),
    }),
    {
      name: 'abn-ui',
      partialize: (state) => ({ mobileNavVisible: state.mobileNavVisible }),
    },
  ),
)
