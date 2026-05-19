import * as React from 'react'
import { cn } from '@/shared/lib/utils'
import { formatCurrency } from '@/core/utils/helpers'
import { Badge } from '@/shared/components/ui/badge'
import type { Product } from '@/domain/entities'
import { Plus, AlertCircle } from 'lucide-react'

export interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product
  onAddToRfq?: (product: Product, quantity: number) => void
  onView?: (product: Product) => void
  compact?: boolean
}

function getStockStatus(product: Product) {
  if (product.stock === 0) return { label: 'Out of stock', variant: 'destructive' as const }
  if (product.stock <= 5) return { label: `Only ${product.stock} left`, variant: 'warning' as const }
  if (product.stock <= 20) return { label: 'Low stock', variant: 'default' as const }
  return { label: 'In stock', variant: 'success' as const }
}

function getPrimarySpec(product: Product): string | null {
  const attrs = product.attributes
  const keys = Object.keys(attrs)
  if (keys.length === 0) return null
  const primary = keys[0]
  return `${primary}: ${attrs[primary]}`
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ className, product, onAddToRfq, onView, compact = false, ...props }, ref) => {
    const [quantity, setQuantity] = React.useState(product.minOrderQuantity)
    const stock = getStockStatus(product)
    const spec = getPrimarySpec(product)
    const isOutOfStock = product.stock === 0

    return (
      <div
        ref={ref}
        className={cn(
          'group rounded-lg border border-border bg-surface transition-all duration-150 hover:shadow-md hover:border-border-strong',
          className,
        )}
        {...props}
      >
        <button
          onClick={() => onView?.(product)}
          className="block w-full text-left"
          aria-label={`View ${product.name}`}
        >
          <div className={cn(
            'relative overflow-hidden bg-surface-active',
            compact ? 'aspect-[4/3]' : 'aspect-square',
          )}>
            <img
              src={product.thumbnail}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
              loading="lazy"
            />
            <div className="absolute top-2 left-2">
              <Badge variant={stock.variant} className="text-[10px] px-1.5 py-0">
                {stock.label}
              </Badge>
            </div>
          </div>
        </button>

        <div className={cn('p-3', compact && 'p-2.5')}>
          {product.brand && (
            <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
              {product.brand}
            </p>
          )}

          <button
            onClick={() => onView?.(product)}
            className="mt-0.5 text-left text-sm font-medium text-text line-clamp-2 leading-snug hover:text-primary transition-colors"
          >
            {product.name}
          </button>

          {spec && (
            <p className="mt-1 text-xs text-text-secondary truncate">
              {spec}
            </p>
          )}

          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-base font-semibold text-text">
              {formatCurrency(product.price, product.currency)}
            </span>
            <span className="text-xs text-text-muted">/ unit</span>
          </div>

          <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
            <span>SKU: {product.sku}</span>
            <span>&middot;</span>
            <span>Min. {product.minOrderQuantity}</span>
          </div>

          {!isOutOfStock && onAddToRfq && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center rounded-md border border-border bg-surface">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setQuantity((q) => Math.max(product.minOrderQuantity, q - 1))
                  }}
                  className="flex h-8 w-8 items-center justify-center text-text-muted hover:text-text transition-colors rounded-l-md"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-10 text-center text-sm font-medium tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setQuantity((q) => q + 1)
                  }}
                  className="flex h-8 w-8 items-center justify-center text-text-muted hover:text-text transition-colors rounded-r-md"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onAddToRfq(product, quantity)
                }}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover active:bg-primary-active transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                RFQ
              </button>
            </div>
          )}

          {isOutOfStock && (
            <button
              disabled
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-border bg-surface-active px-3 py-2 text-sm text-text-muted cursor-not-allowed"
            >
              <AlertCircle className="h-3.5 w-3.5" />
              Unavailable
            </button>
          )}
        </div>
      </div>
    )
  },
)
ProductCard.displayName = 'ProductCard'

export { ProductCard }
