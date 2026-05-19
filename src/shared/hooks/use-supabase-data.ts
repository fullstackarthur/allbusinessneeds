import * as React from 'react'
import type { Product, Category } from '@/domain/entities'

const EMPTY_PRODUCTS: Product[] = []
const EMPTY_CATEGORIES: Category[] = []

function getUseCases() {
  return import('@/core/container').then((m) => m.useCases)
}

export function useProducts(filters?: { category?: string; page?: number; limit?: number }) {
  const [products, setProducts] = React.useState<Product[]>(EMPTY_PRODUCTS)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [total, setTotal] = React.useState(0)
  const [totalPages, setTotalPages] = React.useState(0)

  const category = filters?.category
  const page = filters?.page
  const limit = filters?.limit

  React.useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getUseCases()
      .then((useCases) => useCases.products.getAll.execute({ category, page, limit }))
      .then((result) => {
        if (!cancelled) {
          setProducts(result.products)
          setTotal(result.total)
          setTotalPages(result.totalPages)
          setLoading(false)
        }
      })
      .catch((err: unknown) => {
        console.error('[useProducts] Failed:', err)
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load products')
          setProducts(EMPTY_PRODUCTS)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [category, page, limit])

  return { products, loading, error, total, totalPages }
}

export function useProductById(id: string) {
  const [product, setProduct] = React.useState<Product | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)

    getUseCases()
      .then((useCases) => useCases.products.getById.execute(id))
      .then((result) => {
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
  const [related, setRelated] = React.useState<Product[]>(EMPTY_PRODUCTS)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!productId) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)

    getUseCases()
      .then((useCases) => useCases.products.getRelated.execute(productId, limit))
      .then((result) => {
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
  const [results, setResults] = React.useState<Product[]>(EMPTY_PRODUCTS)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!query.trim()) {
      setResults(EMPTY_PRODUCTS)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    getUseCases()
      .then((useCases) => useCases.products.search.execute(query, limit))
      .then((result) => {
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
  const [categories, setCategories] = React.useState<Category[]>(EMPTY_CATEGORIES)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getUseCases()
      .then((useCases) => useCases.categories.getAll.execute())
      .then((result) => {
        if (!cancelled) {
          setCategories(result)
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
    if (!slug) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)

    getUseCases()
      .then((useCases) => useCases.categories.getBySlug.execute(slug))
      .then((result) => {
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

export function useRandomProducts(limit = 8) {
  const [products, setProducts] = React.useState<Product[]>(EMPTY_PRODUCTS)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getUseCases()
      .then((useCases) => useCases.products.getRandom.execute(limit))
      .then((result) => {
        if (!cancelled) {
          setProducts(result)
          setLoading(false)
        }
      })
      .catch((err: unknown) => {
        console.error('[useRandomProducts] Failed:', err)
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load products')
          setProducts(EMPTY_PRODUCTS)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [limit])

  return { products, loading, error }
}
