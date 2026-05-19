import { useSearchParams, Link } from 'react-router-dom'
import { ProductCard, ProductCardList, ProductCardSkeleton } from '@/shared/components/ui'
import { FilterBar, FilterDrawer } from '@/shared/components/ui/filter-system'
import { EmptyState } from '@/shared/components/ui/empty-state'
import { useProductFilters } from '@/shared/hooks/use-product-filters'
import { useRfqDraftStore } from '@/presentation/stores/rfq-draft-store'
import { useProducts, useSearchProducts } from '@/shared/hooks/use-supabase-data'
import type { Product } from '@/domain/entities'
import { Search as SearchIcon, Grid3X3, List, SlidersHorizontal } from 'lucide-react'
import * as React from 'react'

function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { filters, sortBy, viewMode, activeFilterCount, toggleFilter, setSortBy, setViewMode, clearAll } = useProductFilters()
  const [filterDrawerOpen, setFilterDrawerOpen] = React.useState(false)

  const { results: searchResults, loading: searchLoading } = useSearchProducts(query, 50)
  const categoryFilter = filters.category?.[0] || ''
  const { products: allProducts, loading: allLoading } = useProducts({ limit: 50, category: categoryFilter || undefined })

  const products = query.trim() ? searchResults : allProducts
  const loading = query.trim() ? searchLoading : allLoading

  const addItem = useRfqDraftStore((state) => state.addItem)
  const initialize = useRfqDraftStore((state) => state.initialize)

  const handleAddToRfq = (product: Product, quantity: number) => {
    initialize()
    addItem({ productId: product.id, productName: product.name, quantity })
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Link to="/" className="hover:text-text transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text">Search</span>
        </div>
        <h1 className="mt-2 text-xl font-semibold text-text">
          {query ? `Search Results for "${query}"` : 'Browse Products'}
        </h1>
        {!loading && (
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

      {loading ? (
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
          title={query ? "No results found" : "No products available"}
          description={query
            ? `No products match "${query}". Try searching by SKU, brand, or category.`
            : 'Products will appear here once available'}
          icon={<SearchIcon className="h-8 w-8" />}
          action={
            query ? (
              <Link to="/">
                <Button variant="outline">Browse Catalog</Button>
              </Link>
            ) : undefined
          }
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToRfq={handleAddToRfq}
              onView={() => {}}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <ProductCardList
              key={product.id}
              product={product}
              onAddToRfq={() => handleAddToRfq(product, product.minOrderQuantity)}
              onView={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  )
}

import { Button } from '@/shared/components/ui/button'

export { SearchPage }
