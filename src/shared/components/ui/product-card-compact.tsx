import { cn } from '@/shared/lib/utils'
import { formatCurrency } from '@/core/utils/helpers'
import type { Product } from '@/domain/entities'

function ProductCardCompact({
  product,
  onAddToCart,
  onView,
  className,
}: {
  product: Product
  onAddToCart?: (product: Product) => void
  onView?: (product: Product) => void
  className?: string
}) {
  const stockLabel = product.stock === 0
    ? 'Out of stock'
    : product.stock <= 5
      ? `${product.stock} left`
      : 'In stock'

  const stockColor = product.stock === 0
    ? 'text-destructive'
    : product.stock <= 5
      ? 'text-warning'
      : 'text-success'

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border border-border bg-surface p-3 transition-colors hover:border-border-strong min-w-0',
        className,
      )}
    >
      <button
        onClick={() => onView?.(product)}
        className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-surface-active"
        aria-label={`View ${product.name}`}
      >
        <img
          src={product.thumbnail}
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </button>

      <div className="flex-1 min-w-0">
        <button
          onClick={() => onView?.(product)}
          className="text-sm font-medium text-text truncate text-left hover:text-primary transition-colors w-full"
        >
          {product.name}
        </button>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-text-muted">
          <span className="truncate">SKU: {product.sku}</span>
          <span className="shrink-0">&middot;</span>
          <span className={cn('font-medium shrink-0', stockColor)}>{stockLabel}</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span className="text-sm font-semibold text-text whitespace-nowrap">
          {formatCurrency(product.price, product.currency)}
        </span>
        {onAddToCart && product.stock > 0 && (
          <button
            onClick={() => onAddToCart(product)}
            className="rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground hover:bg-primary-hover transition-colors whitespace-nowrap"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  )
}

export { ProductCardCompact }
