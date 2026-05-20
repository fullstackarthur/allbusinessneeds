import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/core/constants'
import { ProductCard } from '@/shared/components/ui/product-card'
import { ProductCardCompact } from '@/shared/components/ui/product-card-compact'
import { ProductCardSkeleton } from '@/shared/components/ui/skeleton'
import { Button } from '@/shared/components/ui/button'
import { useUiStore } from '@/presentation/stores/ui-store'
import { useCartStore } from '@/presentation/stores/cart-store'
import { useRecentlyViewed } from '@/shared/hooks/use-recently-viewed'
import { useProducts, useCategories } from '@/shared/hooks/use-supabase-data'
import { useMediaQuery } from '@/shared/hooks/use-media-query'
import type { Product } from '@/domain/entities'
import { Search, Sparkles, Grid3X3, ArrowRight, FileText, TrendingUp } from 'lucide-react'

function HomePage() {
  const navigate = useNavigate()
  const setSearchOpen = useUiStore((state) => state.setSearchOpen)
  const isMobile = useMediaQuery('(max-width: 1023px)')
  const addItem = useCartStore((state) => state.addItem)
  const { items: recentlyViewed } = useRecentlyViewed()
  const { products, loading } = useProducts({ limit: 20 })
  const { categories, loading: categoriesLoading } = useCategories()
  const displayCategories = categories.slice(0, 4)

  const seed = Math.floor(Date.now() / (1000 * 60 * 60))
  const shuffled = [...products].sort((a, b) => {
    const hashA = Math.sin(seed + a.id.charCodeAt(0)) * 10000
    const hashB = Math.sin(seed + b.id.charCodeAt(0)) * 10000
    return (hashA % 1) - (hashB % 1)
  })
  const featuredProducts = shuffled.slice(0, 8)
  const compactProducts = shuffled.slice(0, 4)

  const handleAddToCart = (product: Product, quantity: number) => {
    addItem({
      id: Math.random().toString(36).slice(2, 11),
      product,
      quantity,
      unitPrice: product.price,
      totalPrice: product.price * quantity,
    })
  }

  const handleCompactAdd = (product: Product) => {
    addItem({
      id: Math.random().toString(36).slice(2, 11),
      product,
      quantity: product.minOrderQuantity,
      unitPrice: product.price,
      totalPrice: product.price * product.minOrderQuantity,
    })
  }

  const handleViewProduct = (product: Product) => {
    navigate(`/experience/products/${product.id}`)
  }

  return (
    <div className="space-y-8">
      {/* Search Hero */}
      <section className="relative rounded-xl border border-border bg-surface p-6 sm:p-8">
        <div className="max-w-2xl">
          <h1 className="text-xl sm:text-2xl font-semibold text-text">
            Procurement Catalog
          </h1>
          <p className="mt-1.5 text-sm text-text-secondary">
            Source office supplies, request quotations, and manage procurement
          </p>

          <button
            onClick={() => {
              if (isMobile) {
                navigate(ROUTES.SEARCH)
              } else {
                setSearchOpen(true)
              }
            }}
            className="mt-5 flex w-full items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-muted hover:border-border-strong hover:text-text transition-colors text-left"
          >
            <Search className="h-5 w-5 shrink-0" />
            <span>Search products, SKUs, specifications...</span>
            <kbd className="ml-auto hidden h-6 items-center gap-1 rounded border border-border bg-surface-active px-2 text-[10px] font-medium sm:inline-flex">
              Ctrl K
            </kbd>
          </button>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link to={ROUTES.AI_COPILOT}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                AI Sourcing
              </Button>
            </Link>
            <Link to={ROUTES.RFQS}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                My RFQs
              </Button>
            </Link>
            <Button variant="outline" size="sm" className="gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              Bulk Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-text">Browse Categories</h2>
          <Link
            to={ROUTES.CATEGORIES}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover transition-colors"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {categoriesLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 rounded-lg border border-border bg-surface p-4 animate-pulse"
              >
                <div className="h-10 w-10 rounded-lg bg-surface-active" />
                <div className="h-4 w-20 rounded bg-surface-active" />
                <div className="h-3 w-14 rounded bg-surface-active" />
              </div>
            ))
          ) : (
            displayCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`${ROUTES.CATEGORIES}/${cat.slug}`}
                className="group flex flex-col items-center gap-2 rounded-lg border border-border bg-surface p-4 text-center transition-all duration-150 hover:border-border-strong hover:shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-muted text-lg">
                  <Grid3X3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text group-hover:text-primary transition-colors">
                    {cat.name}
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">{cat.productCount} products</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-text">Featured Supplies</h2>
          <Link
            to={ROUTES.SEARCH}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover transition-colors"
          >
            Browse all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onView={handleViewProduct}
                compact
              />
            ))}
          </div>
        )}
      </section>

      {/* Compact Product Cards */}
      <section>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-text">Quick Add</h2>
            <p className="mt-0.5 text-sm text-text-secondary">Popular items for fast procurement</p>
          </div>
          <Link
            to={ROUTES.SEARCH}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover transition-colors"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="mt-4 grid gap-2 grid-cols-1 sm:grid-cols-2">
            {compactProducts.map((product) => (
              <ProductCardCompact
                key={product.id}
                product={product}
                onAddToCart={handleCompactAdd}
                onView={handleViewProduct}
              />
            ))}
          </div>
        )}
      </section>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="sm:-mx-0">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold text-text">Recently Viewed</h2>
          </div>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-4 sm:px-0 snap-x snap-mandatory scrollbar-none">
            {recentlyViewed.map((product) => (
              <div key={product.id} className="w-[160px] sm:w-[180px] shrink-0 snap-start">
                <ProductCard
                  product={product}
                onAddToCart={handleAddToCart}
                  onView={handleViewProduct}
                  compact
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* AI Sourcing CTA */}
      <section className="rounded-xl border border-border bg-surface p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-muted">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-text">AI Sourcing Copilot</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Get intelligent product recommendations, pricing insights, and supplier alternatives
            </p>
          </div>
            <Link to={ROUTES.AI_COPILOT}>
            <Button className="shrink-0">
              Start Sourcing
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export { HomePage }
