import { Link } from 'react-router-dom'
import { ProductCard } from '@/shared/components/ui'
import { useRfqDraftStore } from '@/presentation/stores/rfq-draft-store'
import { useBrands, mockProducts } from '@/shared/hooks/use-products'
import type { Product } from '@/domain/entities'
import { ArrowRight } from 'lucide-react'

function BrandsPage() {
  const { brands, loading } = useBrands()
  const addItem = useRfqDraftStore((state) => state.addItem)
  const initialize = useRfqDraftStore((state) => state.initialize)

  const handleAddToRfq = (product: Product, quantity: number) => {
    initialize()
    addItem({ productId: product.id, productName: product.name, quantity })
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Link to="/" className="hover:text-text transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text">Brands</span>
        </div>
        <h1 className="mt-2 text-xl font-semibold text-text">Brands</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Browse products by manufacturer
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-surface p-6">
              <div className="h-12 w-24 rounded bg-surface-active animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              to={`/brands/${brand.id}`}
              className="flex flex-col items-center gap-3 rounded-lg border border-border bg-surface p-6 text-center transition-all duration-150 hover:border-border-strong hover:shadow-sm"
            >
              <div className="h-12 w-24 overflow-hidden rounded bg-surface-active">
                <img src={brand.logo} alt={brand.name} className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="text-sm font-medium text-text">{brand.name}</p>
                <p className="mt-0.5 text-xs text-text-muted">{brand.productCount} products</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Featured Brand Products */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-text">Popular Brand Products</h2>
          <Link
            to="/search"
            className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover transition-colors"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {mockProducts.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToRfq={handleAddToRfq}
              onView={() => {}}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export { BrandsPage }
