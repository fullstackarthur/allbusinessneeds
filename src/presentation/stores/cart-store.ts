import { create } from 'zustand'
import type { Cart, CartItem } from '@/domain/entities'
import { useCases } from '@/core/container'

interface CartState {
  cart: Cart | null
  isLoading: boolean
  error: string | null
  itemCount: number

  fetchCart: () => Promise<void>
  addItem: (item: CartItem) => Promise<void>
  updateItem: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clear: () => Promise<void>
  reset: () => void
}

export const useCartStore = create<CartState>()((set) => ({
  cart: null,
  isLoading: false,
  error: null,
  itemCount: 0,

  fetchCart: async () => {
    set({ isLoading: true, error: null })
    try {
      const cart = await useCases.cart.get.execute()
      set({ cart, itemCount: cart.itemCount, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch cart',
        isLoading: false,
      })
    }
  },

  addItem: async (item: CartItem) => {
    set({ isLoading: true, error: null })
    try {
      const cart = await useCases.cart.add.execute(item)
      set({ cart, itemCount: cart.itemCount, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add item',
        isLoading: false,
      })
    }
  },

  updateItem: async (itemId: string, quantity: number) => {
    set({ isLoading: true, error: null })
    try {
      const cart = await useCases.cart.update.execute(itemId, quantity)
      set({ cart, itemCount: cart.itemCount, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update item',
        isLoading: false,
      })
    }
  },

  removeItem: async (itemId: string) => {
    set({ isLoading: true, error: null })
    try {
      const cart = await useCases.cart.remove.execute(itemId)
      set({ cart, itemCount: cart.itemCount, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to remove item',
        isLoading: false,
      })
    }
  },

  clear: async () => {
    set({ isLoading: true, error: null })
    try {
      await useCases.cart.clear.execute()
      set({ cart: null, itemCount: 0, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to clear cart',
        isLoading: false,
      })
    }
  },

  reset: () => {
    set({ cart: null, isLoading: false, error: null, itemCount: 0 })
  },
}))
