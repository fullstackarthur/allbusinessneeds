import * as React from 'react'
import { cn } from '@/shared/lib/utils'
import { formatCurrency } from '@/core/utils/helpers'
import { Badge } from '@/shared/components/ui/badge'
import type { Product } from '@/domain/entities'

export interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product
  onAddToRfq?: (product: Product) => void
  onView?: (product: Product) => void
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ className, product, onAddToRfq, onView, ...props }, ref) => {
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
          <div className="aspect-square overflow-hidden rounded-t-lg bg-surface-active">
            <img
              src={product.thumbnail}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
        </button>

        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <button
              onClick={() => onView?.(product)}
              className="text-left text-sm font-medium text-text line-clamp-2 hover:text-primary transition-colors"
            >
              {product.name}
            </button>
            {product.stock <= 5 && product.stock > 0 && (
              <Badge variant="warning" className="shrink-0">
                Low stock
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="destructive" className="shrink-0">
                Out of stock
              </Badge>
            )}
          </div>

          {product.brand && (
            <p className="mt-1 text-xs text-text-muted">{product.brand}</p>
          )}

          <div className="mt-2 flex items-center justify-between">
            <p className="text-base font-semibold text-text">
              {formatCurrency(product.price, product.currency)}
            </p>
            <span className="text-xs text-text-muted">
              Min. {product.minOrderQuantity}
            </span>
          </div>

          {onAddToRfq && product.stock > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAddToRfq(product)
              }}
              className="mt-3 w-full rounded-md border border-primary bg-primary-muted px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10 active:bg-primary/15 focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Add to RFQ
            </button>
          )}
        </div>
      </div>
    )
  },
)
ProductCard.displayName = 'ProductCard'

export { ProductCard }
