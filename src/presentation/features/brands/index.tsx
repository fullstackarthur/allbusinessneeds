import { Link } from 'react-router-dom'
import { ROUTES } from '@/core/constants'
import { ProductCard, ProductCardSkeleton } from '@/shared/components/ui'
import { useRfqDraftStore } from '@/presentation/stores/rfq-draft-store'
import { useProducts } from '@/shared/hooks/use-supabase-data'
import type { Product } from '@/domain/entities'
import { ArrowRight } from 'lucide-react'

function BrandsPage() {
  const { products, loading } = useProducts({ limit: 4 })
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
          <Link to={ROUTES.EXPERIENCE_HOME} className="hover:text-text transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text">Brands</span>
        </div>
        <h1 className="mt-2 text-xl font-semibold text-text">Brands</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Browse products by manufacturer
        </p>
      </div>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-text">Featured Products</h2>
          <Link
            to={ROUTES.SEARCH}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover transition-colors"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
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
    </div>
  )
}

export { BrandsPage }
