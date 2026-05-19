import { EmptyState } from '@/shared/components/ui/empty-state'
import { ShoppingCart } from 'lucide-react'

function CartPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text">Cart</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Review items before checkout
        </p>
      </div>

      <EmptyState
        title="Your cart is empty"
        description="Add products to your cart to proceed with checkout"
        icon={<ShoppingCart className="h-8 w-8" />}
      />
    </div>
  )
}

export { CartPage }
