import { EmptyState } from '@/shared/components/ui/empty-state'
import { Package } from 'lucide-react'

function ProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text">Product Details</h1>
        <p className="mt-1 text-sm text-text-secondary">
          View product information and add to RFQ
        </p>
      </div>

      <EmptyState
        title="Select a product"
        description="Browse the catalog and select a product to view details"
        icon={<Package className="h-8 w-8" />}
      />
    </div>
  )
}

export { ProductPage }
