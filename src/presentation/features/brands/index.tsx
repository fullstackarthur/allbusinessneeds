import { Link } from 'react-router-dom'
import { ROUTES } from '@/core/constants'
import { ProductCard, ProductCardSkeleton } from '@/shared/components/ui'
import { useCartStore } from '@/presentation/stores/cart-store'
import { useProducts } from '@/shared/hooks/use-supabase-data'
import type { Product } from '@/domain/entities'
import { ArrowRight } from 'lucide-react'

function BrandsPage() {
  const { products, loading } = useProducts({ limit: 4 })
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
                cartQuantity={getCartQuantity(product.id)}
                onAddToCart={handleAddToCart}
                onUpdateCart={handleUpdateCart}
                onRemoveFromCart={handleRemoveFromCart}
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
