import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/shared/lib/utils'
import { Input } from '@/shared/components/ui/input'
import { formatCurrency } from '@/core/utils/helpers'
import { useUiStore } from '@/presentation/stores/ui-store'
import { useSearchProducts, useCategories } from '@/shared/hooks/use-supabase-data'
import { useMediaQuery } from '@/shared/hooks/use-media-query'
import { Search, Package, Hash, Tag, X, ArrowRight, Loader2 } from 'lucide-react'

interface SearchSuggestion {
  type: 'product' | 'sku' | 'category' | 'brand'
  id: string
  label: string
  sublabel?: string
  price?: number
  currency?: string
  stock?: number
  thumbnail?: string
}

const MIN_QUERY_LENGTH = 2
const DEBOUNCE_MS = 200
const SEARCH_LIMIT = 8

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = React.useState(value)

  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

function buildSuggestions(
  products: ReturnType<typeof useSearchProducts>['results'],
  categories: ReturnType<typeof useCategories>['categories'],
  query: string,
): SearchSuggestion[] {
  const q = query.toLowerCase()
  const suggestions: SearchSuggestion[] = []

  for (const p of products) {
    suggestions.push({
      type: 'product',
      id: p.id,
      label: p.name,
      sublabel: p.brand || p.category,
      price: p.price,
      currency: p.currency,
      stock: p.stock,
      thumbnail: p.thumbnail,
    })
    if (p.sku && p.sku.toLowerCase().includes(q)) {
      suggestions.push({
        type: 'sku',
        id: p.sku,
        label: p.sku,
        sublabel: p.name,
      })
    }
  }

  const seenCategories = new Set<string>()
  for (const c of categories) {
    if (c.name.toLowerCase().includes(q) && !seenCategories.has(c.slug)) {
      seenCategories.add(c.slug)
      suggestions.push({
        type: 'category',
        id: c.slug,
        label: c.name,
        sublabel: c.productCount ? `${c.productCount} products` : undefined,
      })
    }
  }

  const seenBrands = new Set<string>()
  for (const p of products) {
    if (p.brand && !seenBrands.has(p.brand.toLowerCase())) {
      seenBrands.add(p.brand.toLowerCase())
      suggestions.push({
        type: 'brand',
        id: p.brand.toLowerCase(),
        label: p.brand,
        sublabel: undefined,
      })
    }
  }

  return suggestions.slice(0, SEARCH_LIMIT + 4)
}

function SearchOverlay() {
  const [query, setQuery] = React.useState('')
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const searchOpen = useUiStore((state) => state.searchOpen)
  const setSearchOpen = useUiStore((state) => state.setSearchOpen)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS)
  const shouldSearch = debouncedQuery.length >= MIN_QUERY_LENGTH

  const { results: searchResults, loading: searchLoading } = useSearchProducts(
    shouldSearch ? debouncedQuery : '',
    SEARCH_LIMIT,
  )
  const { categories, loading: categoriesLoading } = useCategories()

  const suggestions = React.useMemo(
    () => (shouldSearch ? buildSuggestions(searchResults, categories, debouncedQuery) : []),
    [searchResults, categories, debouncedQuery, shouldSearch],
  )

  const showRecent = query.length === 0
  const isSearching = searchLoading || categoriesLoading

  React.useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [searchOpen])

  React.useEffect(() => {
    if (!searchOpen) {
      setQuery('')
      setSelectedIndex(-1)
    }
  }, [searchOpen])

  React.useEffect(() => {
    setSelectedIndex(-1)
  }, [suggestions])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!searchOpen) return

      if (e.key === 'Escape') {
        setSearchOpen(false)
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, -1))
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault()
        handleSelect(suggestions[selectedIndex])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [searchOpen, suggestions, selectedIndex])

  const handleSelect = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'product') {
      navigate(`/products/${suggestion.id}`)
    } else if (suggestion.type === 'category') {
      navigate(`/categories/${suggestion.id}`)
    } else if (suggestion.type === 'brand') {
      navigate(`/search?q=${encodeURIComponent(suggestion.label)}`)
    } else if (suggestion.type === 'sku') {
      navigate(`/search?q=${encodeURIComponent(suggestion.label)}`)
    }
    setSearchOpen(false)
  }

  const getTypeIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'product':
        return <Package className="h-4 w-4 text-text-muted" />
      case 'sku':
        return <Hash className="h-4 w-4 text-text-muted" />
      case 'category':
        return <Tag className="h-4 w-4 text-text-muted" />
      case 'brand':
        return <Tag className="h-4 w-4 text-text-muted" />
    }
  }

  if (!searchOpen || !isDesktop) return null

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-background/40 backdrop-blur-md"
        onClick={() => setSearchOpen(false)}
      />

      <div className="relative z-10 absolute inset-0 flex items-start justify-center py-16 px-4">
        <div
          className="w-full max-w-xl rounded-xl border border-border bg-surface shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex h-14 items-center border-b border-border px-4 rounded-t-xl shrink-0">
            <Search className="h-5 w-5 text-text-muted shrink-0" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, SKUs, categories, brands..."
              className="ml-3 border-0 bg-transparent focus-visible:outline-none focus-visible:ring-0 h-auto px-0 text-base"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="ml-2 rounded-md p-1.5 text-text-muted hover:bg-surface-hover hover:text-text transition-colors"
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </button>
            <kbd className="inline-flex h-5 items-center gap-0.5 rounded border border-border bg-surface-active px-1.5 text-[10px] font-medium text-text-muted ml-2">
              ESC
            </kbd>
          </div>

          <div className="overflow-y-auto flex-1" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
            {showRecent && (
              <div className="p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-text-muted mb-3">
                  Popular Categories
                </p>
                {categoriesLoading ? (
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="rounded-lg border border-border bg-surface p-3 animate-pulse">
                        <div className="h-4 w-20 bg-surface-active rounded" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {categories.slice(0, 4).map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => {
                          setQuery(cat.name)
                        }}
                        className="flex items-center justify-between gap-2 rounded-lg border border-border bg-surface p-3 text-sm text-text hover:border-border-strong transition-colors min-w-0"
                      >
                        <span className="truncate">{cat.name}</span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-text-muted" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {isSearching && query.length >= MIN_QUERY_LENGTH && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-text-muted" />
              </div>
            )}

            {suggestions.length > 0 && !isSearching && (
              <div className="py-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.type}-${suggestion.id}`}
                    onClick={() => handleSelect(suggestion)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors',
                      index === selectedIndex ? 'bg-surface-hover' : '',
                    )}
                  >
                    {suggestion.type === 'product' && suggestion.thumbnail ? (
                      <img
                        src={suggestion.thumbnail}
                        alt={suggestion.label}
                        className="h-10 w-10 rounded-md object-cover shrink-0 bg-surface-active"
                      />
                    ) : (
                      getTypeIcon(suggestion.type)
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text truncate">
                        {suggestion.label}
                      </p>
                      {suggestion.sublabel && (
                        <p className="text-xs text-text-muted truncate">
                          {suggestion.sublabel}
                        </p>
                      )}
                    </div>
                    {suggestion.price && (
                      <div className="text-right shrink-0">
                        <p className="text-sm font-medium text-text">
                          {formatCurrency(suggestion.price, suggestion.currency)}
                        </p>
                        {suggestion.stock !== undefined && (
                          <p className={cn(
                            'text-xs',
                            suggestion.stock === 0 ? 'text-destructive' : suggestion.stock <= 5 ? 'text-warning' : 'text-success',
                          )}>
                            {suggestion.stock === 0 ? 'Out of stock' : `${suggestion.stock} in stock`}
                          </p>
                        )}
                      </div>
                    )}
                  </button>
                ))}

                <button
                  onClick={() => {
                    navigate(`/search?q=${encodeURIComponent(query)}`)
                    setSearchOpen(false)
                  }}
                  className="flex w-full items-center justify-center gap-2 border-t border-border px-4 py-3 text-sm font-medium text-primary hover:bg-surface-hover transition-colors"
                >
                  View all results for "{query}"
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {query.length >= MIN_QUERY_LENGTH && suggestions.length === 0 && !isSearching && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-8 w-8 text-text-muted mb-3" />
                <p className="text-sm font-medium text-text">No results found</p>
                <p className="mt-1 text-xs text-text-muted">
                  Try searching by SKU, product name, or category
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export { SearchOverlay }
