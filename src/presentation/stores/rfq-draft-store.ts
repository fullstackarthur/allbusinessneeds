import { create } from 'zustand'
import type { RfqItem } from '@/domain/entities'
import { generateId } from '@/core/utils/helpers'

const EMPTY_ITEMS: RfqItem[] = []
export { EMPTY_ITEMS }

interface RfqDraftState {
  draft: {
    id: string
    items: RfqItem[]
    notes: string
    createdAt: string
  } | null
  isOpen: boolean

  initialize: () => void
  addItem: (item: Omit<RfqItem, 'id'>) => void
  updateItem: (productId: string, updates: Partial<RfqItem>) => void
  removeItem: (productId: string) => void
  setNotes: (notes: string) => void
  clear: () => void
  setOpen: (open: boolean) => void
  getItems: () => RfqItem[]
  getItemCount: () => number
}

export const useRfqDraftStore = create<RfqDraftState>((set, get) => ({
  draft: null,
  isOpen: false,

  initialize: () => {
    const current = get().draft
    if (!current) {
      set({
        draft: {
          id: generateId(),
          items: [],
          notes: '',
          createdAt: new Date().toISOString(),
        },
      })
    }
  },

  addItem: (item: Omit<RfqItem, 'id'>) => {
    set((state) => {
      if (!state.draft) return state
      const existing = state.draft.items.find((i) => i.productId === item.productId)
      if (existing) {
        return {
          draft: {
            ...state.draft,
            items: state.draft.items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i,
            ),
          },
        }
      }
      return {
        draft: {
          ...state.draft,
          items: [...state.draft.items, { ...item, id: generateId() }],
        },
      }
    })
  },

  updateItem: (productId: string, updates: Partial<RfqItem>) => {
    set((state) => {
      if (!state.draft) return state
      return {
        draft: {
          ...state.draft,
          items: state.draft.items.map((i) =>
            i.productId === productId ? { ...i, ...updates } : i,
          ),
        },
      }
    })
  },

  removeItem: (productId: string) => {
    set((state) => {
      if (!state.draft) return state
      return {
        draft: {
          ...state.draft,
          items: state.draft.items.filter((i) => i.productId !== productId),
        },
      }
    })
  },

  setNotes: (notes: string) => {
    set((state) => {
      if (!state.draft) return state
      return { draft: { ...state.draft, notes } }
    })
  },

  clear: () => {
    set({
      draft: {
        id: generateId(),
        items: [],
        notes: '',
        createdAt: new Date().toISOString(),
      },
    })
  },

  setOpen: (open: boolean) => set({ isOpen: open }),

  getItems: () => get().draft?.items ?? EMPTY_ITEMS,
  getItemCount: () => get().draft?.items.length || 0,
}))
