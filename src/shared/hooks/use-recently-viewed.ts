import * as React from 'react'
import type { Product } from '@/domain/entities'

const STORAGE_KEY = 'abn_recently_viewed'
const MAX_ITEMS = 12

export function useRecentlyViewed() {
  const [items, setItems] = React.useState<Product[]>([])

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setItems(JSON.parse(stored))
      }
    } catch {
      setItems([])
    }
  }, [])

  const addViewed = React.useCallback((product: Product) => {
    setItems((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id)
      const updated = [product, ...filtered].slice(0, MAX_ITEMS)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch {
        // storage full or unavailable
      }
      return updated
    })
  }, [])

  const clear = React.useCallback(() => {
    setItems([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }, [])

  return { items, addViewed, clear }
}
