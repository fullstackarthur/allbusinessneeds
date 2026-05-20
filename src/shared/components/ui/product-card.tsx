import * as React from 'react'
import { cn } from '@/shared/lib/utils'
import { formatCurrency } from '@/core/utils/helpers'
import { Badge } from '@/shared/components/ui/badge'
import type { Product } from '@/domain/entities'
import { Plus, AlertCircle } from 'lucide-react'

export interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product
  onAddToCart?: (product: Product, quantity: number) => void
  onView?: (product: Product) => void
  compact?: boolean
}

function getStockStatus(product: Product) {
  if (product.stock === 0) return { label: 'Out of stock', variant: 'destructive' as const }
  if (product.stock <= 5) return { label: `Only ${product.stock} left`, variant: 'warning' as const }
  if (product.stock <= 20) return { label: 'Low stock', variant: 'default' as const }
  return { label: 'In stock', variant: 'success' as const }
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ className, product, onAddToCart, onView, compact = false, ...props }, ref) => {
    const [quantity, setQuantity] = React.useState(product.minOrderQuantity)
    const stock = getStockStatus(product)
    const isOutOfStock = product.stock === 0

    return (
      <div
        ref={ref}
        className={cn(
          'group rounded-lg border border-border bg-surface transition-all duration-150 hover:shadow-md hover:border-border-strong flex flex-col',
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

        <div className={cn('p-2.5 flex flex-col flex-1', compact && 'p-2')}>
          <button
            onClick={() => onView?.(product)}
            className="text-left text-sm font-medium text-text line-clamp-2 leading-snug hover:text-primary transition-colors min-h-[2.5rem]"
          >
            {product.name}
          </button>

          <div className="mt-auto pt-2">
            <div className="flex items-baseline gap-1">
              <span className={cn('font-semibold text-text', compact ? 'text-sm' : 'text-base')}>
                {formatCurrency(product.price, product.currency)}
              </span>
              <span className="text-xs text-text-muted">/ unit</span>
            </div>

            {!compact && (
              <div className="mt-1 flex items-center gap-2 text-xs text-text-muted min-w-0">
                <span className="truncate">SKU: {product.sku}</span>
                <span className="shrink-0">&middot;</span>
                <span className="shrink-0">Min. {product.minOrderQuantity}</span>
              </div>
            )}

            {!isOutOfStock && onAddToCart && (
              <div className={cn('mt-2 flex items-center gap-1.5', compact && 'mt-1.5')}>
                {!compact && (
                  <div className="flex items-center rounded-md border border-border bg-surface shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setQuantity((q) => Math.max(product.minOrderQuantity, q - 1))
                      }}
                      className="flex h-7 w-7 items-center justify-center text-text-muted hover:text-text transition-colors rounded-l-md text-xs"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-medium tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setQuantity((q) => q + 1)
                      }}
                      className="flex h-7 w-7 items-center justify-center text-text-muted hover:text-text transition-colors rounded-r-md text-xs"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onAddToCart(product, quantity)
                  }}
                  className={cn(
                    'flex items-center justify-center gap-1 rounded-md bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active transition-colors',
                    compact ? 'flex-1 px-2 py-1.5 text-xs' : 'flex-1 px-3 py-2 text-sm',
                  )}
                >
                  <Plus className={cn('shrink-0', compact ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
                  <span className="truncate">Add to Cart</span>
                </button>
              </div>
            )}

            {isOutOfStock && (
              <button
                disabled
                className={cn(
                  'mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border border-border bg-surface-active text-text-muted cursor-not-allowed',
                  compact ? 'px-2 py-1.5 text-xs' : 'px-3 py-2 text-sm',
                )}
              >
                <AlertCircle className={cn('shrink-0', compact ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
                <span className="truncate">Unavailable</span>
              </button>
            )}
          </div>
        </div>
      </div>
    )
  },
)
ProductCard.displayName = 'ProductCard'

export { ProductCard }
