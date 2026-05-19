import { cn } from '@/shared/lib/utils'
import { formatCurrency } from '@/core/utils/helpers'
import { Badge } from '@/shared/components/ui/badge'
import type { Product } from '@/domain/entities'
import { ChevronRight } from 'lucide-react'

function ProductCardList({
  product,
  onAddToRfq,
  onView,
  className,
}: {
  product: Product
  onAddToRfq?: (product: Product) => void
  onView?: (product: Product) => void
  className?: string
}) {
  const stockLabel = product.stock === 0
    ? 'Out of stock'
    : product.stock <= 5
      ? `Only ${product.stock} left`
      : product.stock <= 20
        ? 'Low stock'
        : 'In stock'

  const stockVariant = product.stock === 0
    ? 'destructive' as const
    : product.stock <= 5
      ? 'warning' as const
      : product.stock <= 20
        ? 'default' as const
        : 'success' as const

  const specs = Object.entries(product.attributes).slice(0, 2)

  return (
    <div
      className={cn(
        'flex gap-4 rounded-lg border border-border bg-surface p-4 transition-all duration-150 hover:shadow-sm hover:border-border-strong',
        className,
      )}
    >
      <button
        onClick={() => onView?.(product)}
        className="shrink-0"
        aria-label={`View ${product.name}`}
      >
        <div className="h-24 w-24 overflow-hidden rounded-md bg-surface-active sm:h-28 sm:w-28">
          <img
            src={product.thumbnail}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </button>

      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-3">
            <button
              onClick={() => onView?.(product)}
              className="text-left text-base font-medium text-text hover:text-primary transition-colors line-clamp-2"
            >
              {product.name}
            </button>
            <ChevronRight className="h-5 w-5 shrink-0 text-text-muted" />
          </div>

          {product.brand && (
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-text-muted">
              {product.brand}
            </p>
          )}

          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-text-secondary">
            {specs.map(([key, value]) => (
              <span key={key}>
                <span className="text-text-muted">{key}:</span> {value}
              </span>
            ))}
          </div>

          <div className="mt-1.5 flex items-center gap-2 text-xs text-text-muted">
            <span>SKU: {product.sku}</span>
            <span>&middot;</span>
            <span>Min. order: {product.minOrderQuantity}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-text">
              {formatCurrency(product.price, product.currency)}
              <span className="ml-1 text-sm font-normal text-text-muted">/ unit</span>
            </span>
            <Badge variant={stockVariant} className="text-xs">
              {stockLabel}
            </Badge>
          </div>

          {onAddToRfq && product.stock > 0 && (
            <button
              onClick={() => onAddToRfq(product)}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
            >
              Add to RFQ
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export { ProductCardList }
