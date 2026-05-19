import * as React from 'react'
import type { Product } from '@/domain/entities'
import { useCases } from '@/core/container'

export function useProducts(filters?: { category?: string; page?: number; limit?: number }) {
  const [products, setProducts] = React.useState<Product[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [total, setTotal] = React.useState(0)
  const [totalPages, setTotalPages] = React.useState(0)

  React.useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    useCases.products.getAll
      .execute(filters)
      .then((result: { products: Product[]; total: number; totalPages: number; page: number }) => {
        if (!cancelled) {
          setProducts(result.products)
          setTotal(result.total)
          setTotalPages(result.totalPages)
          setLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load products')
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [filters?.category, filters?.page, filters?.limit])

  return { products, loading, error, total, totalPages }
}

export function useProductById(id: string) {
  const [product, setProduct] = React.useState<Product | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    setError(null)

    useCases.products.getById
      .execute(id)
      .then((result: Product) => {
        if (!cancelled) {
          setProduct(result)
          setLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Product not found')
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [id])

  return { product, loading, error }
}

export function useRelatedProducts(productId: string, limit = 4) {
  const [related, setRelated] = React.useState<Product[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!productId) return
    let cancelled = false
    setLoading(true)
    setError(null)

    useCases.products.getRelated
      .execute(productId, limit)
      .then((result: Product[]) => {
        if (!cancelled) {
          setRelated(result)
          setLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load related products')
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [productId, limit])

  return { related, loading, error }
}

export function useSearchProducts(query: string, limit = 10) {
  const [results, setResults] = React.useState<Product[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    useCases.products.search
      .execute(query, limit)
      .then((result: Product[]) => {
        if (!cancelled) {
          setResults(result)
          setLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Search failed')
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [query, limit])

  return { results, loading, error }
}

export function useCategories() {
  const [categories, setCategories] = React.useState<
    Array<{ id: string; name: string; slug: string; productCount: number }>
  >([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    useCases.categories.getAll
      .execute()
      .then((result: Array<{ id: string; name: string; slug: string }>) => {
        if (!cancelled) {
          setCategories(result.map((c: { id: string; name: string; slug: string }) => ({ ...c, productCount: 0 })))
          setLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load categories')
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { categories, loading, error }
}

export function useCategoryBySlug(slug: string) {
  const [category, setCategory] = React.useState<{ id: string; name: string; slug: string } | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!slug) return
    let cancelled = false
    setLoading(true)
    setError(null)

    useCases.categories.getBySlug
      .execute(slug)
      .then((result: { id: string; name: string; slug: string }) => {
        if (!cancelled) {
          setCategory({ id: result.id, name: result.name, slug: result.slug })
          setLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Category not found')
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  return { category, loading, error }
}
