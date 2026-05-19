import { Link } from 'react-router-dom'
import { ProductCard } from '@/shared/components/ui/product-card'
import { ProductCardCompact } from '@/shared/components/ui/product-card-compact'
import { ProductCardSkeleton } from '@/shared/components/ui/skeleton'
import { Button } from '@/shared/components/ui/button'
import { useUiStore } from '@/presentation/stores/ui-store'
import { useRfqDraftStore } from '@/presentation/stores/rfq-draft-store'
import { useRecentlyViewed } from '@/shared/hooks/use-recently-viewed'
import { useProducts, mockProducts } from '@/shared/hooks/use-products'
import type { Product } from '@/domain/entities'
import { Search, Sparkles, Grid3X3, ArrowRight, FileText, TrendingUp } from 'lucide-react'

const procurementCategories = [
  { id: 'paper', name: 'Paper & Printing', slug: 'paper', count: 145, icon: '📄' },
  { id: 'writing', name: 'Writing Instruments', slug: 'writing', count: 98, icon: '✏️' },
  { id: 'organization', name: 'Filing & Organization', slug: 'organization', count: 76, icon: '📁' },
  { id: 'desk', name: 'Desk Accessories', slug: 'desk', count: 112, icon: '📎' },
  { id: 'technology', name: 'Technology', slug: 'technology', count: 64, icon: '💻' },
  { id: 'breakroom', name: 'Breakroom', slug: 'breakroom', count: 43, icon: '☕' },
  { id: 'cleaning', name: 'Cleaning & Hygiene', slug: 'cleaning', count: 58, icon: '🧹' },
  { id: 'shipping', name: 'Shipping & Mailing', slug: 'shipping', count: 37, icon: '📦' },
]

const procurementCollections = [
  { id: 'essentials', name: 'Office Essentials', description: 'Everyday supplies for smooth operations', products: mockProducts.slice(0, 4) },
  { id: 'eco', name: 'Eco-Friendly Range', description: 'Sustainable procurement options', products: mockProducts.slice(4, 8) },
  { id: 'bulk', name: 'Bulk Procurement', description: 'High-volume cost-effective supplies', products: mockProducts.slice(8, 12) },
]

function HomePage() {
  const setSearchOpen = useUiStore((state) => state.setSearchOpen)
  const addItem = useRfqDraftStore((state) => state.addItem)
  const initialize = useRfqDraftStore((state) => state.initialize)
  const { items: recentlyViewed } = useRecentlyViewed()
  const { products, loading } = useProducts()

  const featuredProducts = products.slice(0, 8)

  const handleAddToRfq = (product: Product, quantity: number) => {
    initialize()
    addItem({
      productId: product.id,
      productName: product.name,
      quantity,
    })
  }

  const handleCompactAdd = (product: Product) => {
    initialize()
    addItem({
      productId: product.id,
      productName: product.name,
      quantity: product.minOrderQuantity,
    })
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
            onClick={() => setSearchOpen(true)}
            className="mt-5 flex w-full items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-muted hover:border-border-strong hover:text-text transition-colors text-left"
          >
            <Search className="h-5 w-5 shrink-0" />
            <span>Search products, SKUs, specifications...</span>
            <kbd className="ml-auto hidden h-6 items-center gap-1 rounded border border-border bg-surface-active px-2 text-[10px] font-medium sm:inline-flex">
              Ctrl K
            </kbd>
          </button>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/ai">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                AI Sourcing
              </Button>
            </Link>
            <Link to="/rfqs">
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
            to="/categories"
            className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover transition-colors"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {procurementCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.slug}`}
              className="group flex flex-col items-center gap-2 rounded-lg border border-border bg-surface p-4 text-center transition-all duration-150 hover:border-border-strong hover:shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-muted text-lg">
                <Grid3X3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-text group-hover:text-primary transition-colors">
                  {cat.name}
                </p>
                <p className="mt-0.5 text-xs text-text-muted">{cat.count} products</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-text">Featured Supplies</h2>
          <Link
            to="/search"
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
                onAddToRfq={handleAddToRfq}
                onView={() => {}}
              />
            ))}
          </div>
        )}
      </section>

      {/* Procurement Collections */}
      {procurementCollections.map((collection) => (
        <section key={collection.id}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-text">{collection.name}</h2>
              <p className="mt-0.5 text-sm text-text-secondary">{collection.description}</p>
            </div>
            <Link
              to="/search"
              className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover transition-colors"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {collection.products.map((product) => (
              <ProductCardCompact
                key={product.id}
                product={product}
                onAddToRfq={handleCompactAdd}
              />
            ))}
          </div>
        </section>
      ))}

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-text">Recently Viewed</h2>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            {recentlyViewed.map((product) => (
              <div key={product.id} className="w-36 shrink-0">
                <ProductCard
                  product={product}
                  onAddToRfq={handleAddToRfq}
                  onView={() => {}}
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
          <Link to="/ai">
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
