import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/shared/lib/utils'
import { Input } from '@/shared/components/ui/input'
import { formatCurrency } from '@/core/utils/helpers'
import { useUiStore } from '@/presentation/stores/ui-store'
import { debounce } from '@/core/utils/helpers'
import { Search, Package, Hash, Tag, X, ArrowRight } from 'lucide-react'

interface SearchSuggestion {
  type: 'product' | 'sku' | 'category' | 'brand'
  id: string
  label: string
  sublabel?: string
  price?: number
  currency?: string
  stock?: number
}

const mockSuggestions: SearchSuggestion[] = [
  { type: 'product', id: '1', label: 'Premium A4 Copy Paper - 80gsm', sublabel: 'PaperPro', price: 24.99, currency: 'USD', stock: 150 },
  { type: 'product', id: '2', label: 'A4 Copy Paper - 70gsm (Economy)', sublabel: 'ValuePrint', price: 18.50, currency: 'USD', stock: 300 },
  { type: 'sku', id: 'PPR-A4-80-5R', label: 'PPR-A4-80-5R', sublabel: 'Premium A4 Copy Paper' },
  { type: 'category', id: 'paper', label: 'Paper & Printing', sublabel: '145 products' },
  { type: 'brand', id: 'paperpro', label: 'PaperPro', sublabel: '23 products' },
  { type: 'product', id: '3', label: 'Ballpoint Pen - Blue Ink (Box of 50)', sublabel: 'WriteWell', price: 12.50, currency: 'USD', stock: 3 },
  { type: 'product', id: '4', label: 'Sticky Notes Assorted - 12 Pads', sublabel: 'NoteMaster', price: 8.99, currency: 'USD', stock: 200 },
  { type: 'sku', id: 'PEN-BP-BL-50', label: 'PEN-BP-BL-50', sublabel: 'Ballpoint Pen Blue' },
  { type: 'brand', id: 'writewell', label: 'WriteWell', sublabel: '18 products' },
  { type: 'category', id: 'writing', label: 'Writing Instruments', sublabel: '98 products' },
]

const recentSearches = ['A4 paper', 'ballpoint pens', 'sticky notes', 'binder clips']

function SearchOverlay() {
  const [query, setQuery] = React.useState('')
  const [suggestions, setSuggestions] = React.useState<SearchSuggestion[]>([])
  const [showRecent, setShowRecent] = React.useState(true)
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const searchOpen = useUiStore((state) => state.searchOpen)
  const setSearchOpen = useUiStore((state) => state.setSearchOpen)

  const debouncedSearch = React.useMemo(
    () => debounce((q: unknown) => {
      const query = q as string
      if (query.length < 2) {
        setSuggestions([])
        return
      }
      const filtered = mockSuggestions.filter(
        (s) =>
          s.label.toLowerCase().includes(query.toLowerCase()) ||
          s.sublabel?.toLowerCase().includes(query.toLowerCase()),
      )
      setSuggestions(filtered.slice(0, 8))
    }, 150),
    [],
  )

  React.useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [searchOpen])

  React.useEffect(() => {
    if (!searchOpen) {
      setQuery('')
      setSuggestions([])
      setShowRecent(true)
      setSelectedIndex(-1)
    }
  }, [searchOpen])

  React.useEffect(() => {
    debouncedSearch(query)
    setShowRecent(query.length === 0)
    setSelectedIndex(-1)
  }, [query, debouncedSearch])

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
      navigate(`/brands/${suggestion.id}`)
    } else if (suggestion.type === 'sku') {
      navigate(`/products/${suggestion.id}`)
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

  if (!searchOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background sm:py-8">
      <div className="mx-auto h-full max-w-2xl sm:h-auto sm:rounded-xl sm:border sm:border-border sm:bg-surface sm:shadow-xl">
        <div className="flex h-14 items-center border-b border-border px-4 sm:rounded-t-xl">
          <Search className="h-5 w-5 text-text-muted" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, SKUs, categories, brands..."
            className="ml-3 border-0 bg-transparent focus-visible:outline-none focus-visible:ring-0 h-auto px-0 text-base"
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="ml-2 rounded-md p-1.5 text-text-muted hover:bg-surface-hover hover:text-text transition-colors sm:hidden"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
          <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-surface-active px-1.5 text-[10px] font-medium text-text-muted">
            ESC
          </kbd>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 3.5rem)' }}>
          {showRecent && query.length === 0 && (
            <div className="p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-text-muted mb-3">
                Recent Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-hover hover:text-text transition-colors"
                  >
                    <Search className="h-3 w-3" />
                    {term}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <p className="text-xs font-medium uppercase tracking-wider text-text-muted mb-3">
                  Popular Categories
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {['Paper & Printing', 'Writing Instruments', 'Desk Accessories', 'Technology'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setQuery(cat)
                      }}
                      className="flex items-center justify-between rounded-lg border border-border bg-surface p-3 text-sm text-text hover:border-border-strong transition-colors"
                    >
                      <span>{cat}</span>
                      <ArrowRight className="h-4 w-4 text-text-muted" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {suggestions.length > 0 && (
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
                  {getTypeIcon(suggestion.type)}
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
                    <div className="text-right">
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

          {query.length >= 2 && suggestions.length === 0 && (
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
  )
}

export { SearchOverlay }
