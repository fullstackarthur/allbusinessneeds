import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { useCartStore } from '@/presentation/stores/cart-store'
import { useUiStore } from '@/presentation/stores/ui-store'
import { formatCurrency } from '@/core/utils/helpers'
import { ROUTES } from '@/core/constants'
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
} from 'lucide-react'

function CartPage() {
  const cart = useCartStore((state) => state.cart)
  const updateItem = useCartStore((state) => state.updateItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const clear = useCartStore((state) => state.clear)
  const isLoading = useCartStore((state) => state.isLoading)
  const showPrices = useUiStore((s) => s.showPrices)

  const items = cart?.items || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-active">
          <ShoppingCart className="h-7 w-7 text-text-muted" />
        </div>
        <h2 className="text-lg font-semibold text-text">Your cart is empty</h2>
        <p className="mt-1 text-sm text-text-secondary max-w-sm">
          Browse our catalog and add products to your cart
        </p>
        <Link to={ROUTES.EXPERIENCE_HOME} className="mt-4">
          <Button>Browse Catalog</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-text">Shopping Cart</h1>
        <p className="mt-1 text-sm text-text-secondary">
          {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      {/* Items List */}
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4"
          >
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-surface-active">
              <img
                src={item.product.thumbnail}
                alt={item.product.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text truncate">
                {item.product.name}
              </p>
              <p className="mt-0.5 text-xs text-text-muted">
                SKU: {item.product.sku}
              </p>
              {showPrices && (
                <p className="mt-1 text-sm font-semibold text-text sm:hidden">
                  {formatCurrency(item.totalPrice, item.product.currency)}
                </p>
              )}
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-1 rounded-md border border-border bg-surface shrink-0">
              <button
                onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                disabled={item.quantity <= 1}
                className="flex h-8 w-8 items-center justify-center text-text-muted hover:text-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-10 text-center text-sm font-medium tabular-nums">
                {item.quantity}
              </span>
              <button
                onClick={() => updateItem(item.id, item.quantity + 1)}
                className="flex h-8 w-8 items-center justify-center text-text-muted hover:text-text transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Price */}
            {showPrices && (
              <div className="hidden sm:block text-right min-w-[80px] shrink-0">
                <p className="text-sm font-semibold text-text">
                  {formatCurrency(item.totalPrice, item.product.currency)}
                </p>
                <p className="text-xs text-text-muted">
                  {formatCurrency(item.unitPrice, item.product.currency)} / unit
                </p>
              </div>
            )}

            {/* Remove */}
            <button
              onClick={() => removeItem(item.id)}
              className="rounded-md p-2 text-text-muted hover:bg-destructive-muted hover:text-destructive transition-colors shrink-0"
              aria-label={`Remove ${item.product.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      {showPrices && (
        <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">Subtotal</span>
            <span className="font-medium text-text">{formatCurrency(cart?.subtotal || 0)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">Tax (10%)</span>
            <span className="font-medium text-text">{formatCurrency(cart?.tax || 0)}</span>
          </div>
          <div className="border-t border-border pt-3 flex items-center justify-between">
            <span className="text-base font-semibold text-text">Total</span>
            <span className="text-xl font-semibold text-text">{formatCurrency(cart?.total || 0)}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Link to={ROUTES.EXPERIENCE_HOME} className="flex-1">
          <Button variant="outline" className="w-full">
            Continue Shopping
          </Button>
        </Link>
        <Button onClick={() => clear()} variant="outline" className="text-destructive hover:text-destructive">
          Clear Cart
        </Button>
      </div>
    </div>
  )
}

export { CartPage }
