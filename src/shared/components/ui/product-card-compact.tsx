import { cn } from '@/shared/lib/utils'
import { formatCurrency } from '@/core/utils/helpers'
import type { Product } from '@/domain/entities'

function ProductCardCompact({
  product,
  onAddToRfq,
  className,
}: {
  product: Product
  onAddToRfq?: (product: Product) => void
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
        'flex items-center gap-3 rounded-lg border border-border bg-surface p-3 transition-colors hover:border-border-strong',
        className,
      )}
    >
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-surface-active">
        <img
          src={product.thumbnail}
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text truncate">{product.name}</p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-text-muted">
          <span>SKU: {product.sku}</span>
          <span>&middot;</span>
          <span className={cn('font-medium', stockColor)}>{stockLabel}</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5">
        <span className="text-sm font-semibold text-text">
          {formatCurrency(product.price, product.currency)}
        </span>
        {onAddToRfq && product.stock > 0 && (
          <button
            onClick={() => onAddToRfq(product)}
            className="rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
          >
            Add to RFQ
          </button>
        )}
      </div>
    </div>
  )
}

export { ProductCardCompact }
