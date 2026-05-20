import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/core/constants'
import { ProductCard, ProductCardList, ProductCardSkeleton } from '@/shared/components/ui'
import { FilterBar, FilterDrawer } from '@/shared/components/ui/filter-system'
import { EmptyState } from '@/shared/components/ui/empty-state'
import { useProductFilters } from '@/shared/hooks/use-product-filters'
import { useCartStore } from '@/presentation/stores/cart-store'
import { useSearchProducts } from '@/shared/hooks/use-supabase-data'
import type { Product } from '@/domain/entities'
import { Search as SearchIcon, Grid3X3, List, SlidersHorizontal, X } from 'lucide-react'
import * as React from 'react'

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''
  const [inputValue, setInputValue] = React.useState(query)
  const { filters, sortBy, viewMode, activeFilterCount, toggleFilter, setSortBy, setViewMode, clearAll } = useProductFilters()
  const [filterDrawerOpen, setFilterDrawerOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const { results: searchResults, loading: searchLoading } = useSearchProducts(query, 50)

  const products = query.trim() ? searchResults : []
  const loading = query.trim() ? searchLoading : false

  const cart = useCartStore((state) => state.cart)
  const addItem = useCartStore((state) => state.addItem)
  const updateItem = useCartStore((state) => state.updateItem)
  const removeItem = useCartStore((state) => state.removeItem)

  const getCartQuantity = (productId: string): number => {
    const item = cart?.items.find((i) => i.product.id === productId)
    return item?.quantity || 0
  }

  const getCartItem = (productId: string) => {
    return cart?.items.find((i) => i.product.id === productId)
  }

  const handleAddToCart = (product: Product, quantity: number) => {
    addItem({
      id: Math.random().toString(36).slice(2, 11),
      product,
      quantity,
      unitPrice: product.price,
      totalPrice: product.price * quantity,
    })
  }

  const handleUpdateCart = (product: Product, quantity: number) => {
    const item = getCartItem(product.id)
    if (item) updateItem(item.id, quantity)
  }

  const handleRemoveFromCart = (product: Product) => {
    const item = getCartItem(product.id)
    if (item) removeItem(item.id)
  }

  const handleViewProduct = (product: Product) => {
    navigate(`/experience/products/${product.id}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim() })
    } else {
      setSearchParams({})
    }
  }

  const handleClear = () => {
    setInputValue('')
    setSearchParams({})
    inputRef.current?.focus()
  }

  React.useEffect(() => {
    setInputValue(query)
  }, [query])

  return (
    <div className="space-y-4">
      {/* Mobile Search Input */}
      <div className="lg:hidden">
        <form onSubmit={handleSearch} className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search products, SKUs, categories..."
            className="w-full h-11 pl-10 pr-10 rounded-lg border border-border bg-surface text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            autoFocus
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-surface-active transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-text-muted" />
            </button>
          )}
        </form>
      </div>

      {/* Breadcrumb & Title */}
      <div>
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Link to={ROUTES.EXPERIENCE_HOME} className="hover:text-text transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text">Search</span>
        </div>
        <h1 className="mt-2 text-xl font-semibold text-text">
          {query ? `Search Results for "${query}"` : 'Search Products'}
        </h1>
        {!loading && query && (
          <p className="mt-1 text-sm text-text-secondary">
            {products.length} products found
          </p>
        )}
      </div>

      {/* Filter Bar */}
      <div className="sticky top-14 z-20 -mx-4 bg-background/95 px-4 py-3 backdrop-blur-sm lg:top-14">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterDrawerOpen(true)}
            className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-secondary hover:bg-surface-hover transition-colors lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="hidden lg:flex items-center gap-2 flex-1">
            <FilterBar
              activeFilters={filters}
              sortBy={sortBy}
              onFilterChange={toggleFilter}
              onSortChange={setSortBy}
              onClearAll={clearAll}
              resultCount={products.length}
            />
          </div>

          <div className="ml-auto flex items-center gap-1 rounded-md border border-border bg-surface p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-surface-active text-text' : 'text-text-muted hover:text-text'}`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded p-1.5 transition-colors ${viewMode === 'list' ? 'bg-surface-active text-text' : 'text-text-muted hover:text-text'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <FilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        activeFilters={filters}
        onFilterChange={toggleFilter}
        onClearAll={clearAll}
        onApply={() => setFilterDrawerOpen(false)}
      />

      {!query ? (
        <EmptyState
          title="Search for products"
          description="Enter a product name, SKU, or category to find what you need"
          icon={<SearchIcon className="h-8 w-8" />}
        />
      ) : loading ? (
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4'
          : 'space-y-3'
        }>
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          title="No results found"
          description={`No products match "${query}". Try searching by SKU, brand, or category.`}
          icon={<SearchIcon className="h-8 w-8" />}
          action={
            <Link to={ROUTES.EXPERIENCE_HOME}>
              <Button variant="outline">Browse Catalog</Button>
            </Link>
          }
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cartQuantity={getCartQuantity(product.id)}
              onAddToCart={handleAddToCart}
              onUpdateCart={handleUpdateCart}
              onRemoveFromCart={handleRemoveFromCart}
              onView={handleViewProduct}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <ProductCardList
              key={product.id}
              product={product}
              onAddToCart={() => handleAddToCart(product, product.minOrderQuantity)}
              onView={handleViewProduct}
            />
          ))}
        </div>
      )}
    </div>
  )
}

import { Button } from '@/shared/components/ui/button'

export { SearchPage }
