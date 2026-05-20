import { useParams, Link } from 'react-router-dom'
import { ROUTES } from '@/core/constants'
import { Button } from '@/shared/components/ui/button'
import { ProductCard } from '@/shared/components/ui/product-card'
import { ProductCardSkeleton, Skeleton } from '@/shared/components/ui/skeleton'
import { EmptyState } from '@/shared/components/ui/empty-state'
import { useProductById, useRelatedProducts } from '@/shared/hooks/use-supabase-data'
import { useCartStore } from '@/presentation/stores/cart-store'
import { useUiStore } from '@/presentation/stores/ui-store'
import { useRecentlyViewed } from '@/shared/hooks/use-recently-viewed'
import { formatCurrency } from '@/core/utils/helpers'
import { ChevronRight, Plus, Minus, Sparkles, Download, Package, Star, AlertCircle } from 'lucide-react'
import type { Product } from '@/domain/entities'
import * as React from 'react'

function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { product, loading } = useProductById(id || '')
  const { related, loading: relatedLoading } = useRelatedProducts(id || '', 4)
  const cart = useCartStore((state) => state.cart)
  const addItem = useCartStore((state) => state.addItem)
  const updateItem = useCartStore((state) => state.updateItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const { addViewed } = useRecentlyViewed()
  const showPrices = useUiStore((s) => s.showPrices)
  const [quantity, setQuantity] = React.useState(1)
  const [selectedImage, setSelectedImage] = React.useState(0)

  const getCartQuantity = (productId: string): number => {
    const item = cart?.items.find((i) => i.product.id === productId)
    return item?.quantity || 0
  }

  const getCartItem = (productId: string) => {
    return cart?.items.find((i) => i.product.id === productId)
  }

  const handleRelatedAddToCart = (p: Product, q: number) => {
    addItem({
      id: Math.random().toString(36).slice(2, 11),
      product: p,
      quantity: q,
      unitPrice: p.price,
      totalPrice: p.price * q,
    })
  }

  const handleRelatedUpdateCart = (p: Product, q: number) => {
    const item = getCartItem(p.id)
    if (item) updateItem(item.id, q)
  }

  const handleRelatedRemoveFromCart = (p: Product) => {
    const item = getCartItem(p.id)
    if (item) removeItem(item.id)
  }

  React.useEffect(() => {
    if (product) {
      setQuantity(product.minOrderQuantity)
      addViewed(product)
    }
  }, [product, addViewed])

  const handleAddToCart = () => {
    if (!product) return
    addItem({
      id: Math.random().toString(36).slice(2, 11),
      product,
      quantity,
      unitPrice: product.price,
      totalPrice: product.price * quantity,
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Skeleton className="h-4 w-12" />
          <span>/</span>
          <Skeleton className="h-4 w-20" />
          <span>/</span>
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <EmptyState
        title="Product not found"
        description="The product you are looking for does not exist or has been removed"
        icon={<Package className="h-8 w-8" />}
        action={
          <Link to={ROUTES.EXPERIENCE_HOME}>
            <Button>Browse Catalog</Button>
          </Link>
        }
      />
    )
  }

  const images = product.images.length > 0 ? product.images : [product.thumbnail]
  const isOutOfStock = product.stock === 0
  const stockLabel = isOutOfStock
    ? 'Out of stock'
    : product.stock <= 5
      ? `Only ${product.stock} left`
      : product.stock <= 20
        ? 'Low stock'
        : `${product.stock} in stock`

  const stockColor = isOutOfStock
    ? 'text-destructive'
    : product.stock <= 5
      ? 'text-warning'
      : product.stock <= 20
        ? 'text-text-muted'
        : 'text-success'

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-muted">
        <Link to={ROUTES.EXPERIENCE_HOME} className="hover:text-text transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={`${ROUTES.CATEGORIES}/${product.category}`} className="hover:text-text transition-colors capitalize">
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-text truncate">{product.name}</span>
      </nav>

      {/* Product Detail */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square overflow-hidden rounded-lg bg-surface-active">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                    selectedImage === index
                      ? 'border-primary'
                      : 'border-border hover:border-border-strong'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-5">
          <div>
            {product.brand && (
              <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                {product.brand}
              </p>
            )}
            <h1 className="mt-1 text-xl sm:text-2xl font-semibold text-text">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span className="text-sm font-medium text-text">{product.rating}</span>
              <span className="text-sm text-text-muted">({product.reviewCount})</span>
            </div>
            <span className="text-text-muted">&middot;</span>
            <span className={cn('text-sm font-medium', stockColor)}>
              {stockLabel}
            </span>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4">
            {showPrices && (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-text">
                  {formatCurrency(product.price, product.currency)}
                </span>
                <span className="text-sm text-text-muted">/ unit</span>
              </div>
            )}
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
              <span>SKU: <span className="font-mono text-text">{product.sku}</span></span>
              <span>Min. order: {product.minOrderQuantity}</span>
            </div>
          </div>

          <p className="text-sm text-text-secondary leading-relaxed">
            {product.description}
          </p>

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-text">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-md border border-border bg-surface">
                  <button
                    onClick={() => setQuantity((q) => Math.max(product.minOrderQuantity, q - 1))}
                    className="flex h-10 w-10 items-center justify-center text-text-muted hover:text-text transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-14 text-center text-base font-medium tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-10 w-10 items-center justify-center text-text-muted hover:text-text transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {showPrices && (
                  <span className="text-xs text-text-muted">
                    Total: {formatCurrency(product.price * quantity, product.currency)}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {isOutOfStock ? (
              <Button disabled className="flex-1">
                <AlertCircle className="mr-1.5 h-4 w-4" />
                Currently Unavailable
              </Button>
            ) : (
              <Button onClick={handleAddToCart} className="flex-1">
                <Plus className="mr-1.5 h-4 w-4" />
                Add to Cart
              </Button>
            )}
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {/* AI Sourcing CTA */}
          <Link to={ROUTES.AI_COPILOT}>
            <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary-muted/50 p-4 hover:border-primary/40 transition-colors cursor-pointer">
              <Sparkles className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-primary">AI Sourcing Copilot</p>
                <p className="text-xs text-text-muted">Find alternatives and pricing insights</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Specifications */}
      <section>
        <h2 className="text-base font-semibold text-text">Specifications</h2>
        <div className="mt-3 rounded-lg border border-border bg-surface overflow-hidden">
          {Object.entries(product.attributes).map(([key, value], index) => (
            <div
              key={key}
              className={`flex items-center px-4 py-3 ${
                index !== 0 ? 'border-t border-border' : ''
              }`}
            >
              <span className="w-32 text-sm text-text-muted">{key}</span>
              <span className="text-sm font-medium text-text">{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Related Products */}
      <section>
        <h2 className="text-base font-semibold text-text">Related Products</h2>
        {relatedLoading ? (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {related.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                cartQuantity={getCartQuantity(relatedProduct.id)}
                onAddToCart={handleRelatedAddToCart}
                onUpdateCart={handleRelatedUpdateCart}
                onRemoveFromCart={handleRelatedRemoveFromCart}
                onView={() => {}}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export { ProductDetailPage }
