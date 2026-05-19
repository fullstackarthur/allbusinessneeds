import * as React from 'react'
import { cn } from '@/shared/lib/utils'
import { formatCurrency } from '@/core/utils/helpers'
import { Sparkles, Plus, ChevronRight } from 'lucide-react'

interface RecommendedProduct {
  id: string
  name: string
  sku: string
  brand?: string
  price: number
  currency: string
  stock: number
  thumbnail: string
  reason: string
  category: string
}

interface ProcurementRecommendationsProps {
  rfqItems: Array<{ product_id: string; product_name: string; category?: string }>
  onAddToRfq?: (product: RecommendedProduct) => void
  onView?: (product: RecommendedProduct) => void
  className?: string
}

const recommendationRules: Record<string, RecommendedProduct[]> = {
  'paper': [
    {
      id: 'rec-1',
      name: 'Lever Arch Files - A4 (Pack of 10)',
      sku: 'FIL-LVR-A4-10',
      brand: 'FilePro',
      price: 22.00,
      currency: 'USD',
      stock: 45,
      thumbnail: 'https://placehold.co/100x100/f5f4f2/4a5568?text=Files',
      reason: 'Commonly ordered with paper products',
      category: 'organization',
    },
    {
      id: 'rec-2',
      name: 'Stapler - Heavy Duty (200 Sheet)',
      sku: 'STP-HD-200',
      brand: 'StapleMax',
      price: 28.50,
      currency: 'USD',
      stock: 35,
      thumbnail: 'https://placehold.co/100x100/f5f4f2/4a5568?text=Stapler',
      reason: 'Essential for paper processing',
      category: 'desk',
    },
  ],
  'writing': [
    {
      id: 'rec-3',
      name: 'Correction Tape - 5mm x 8m (Pack of 6)',
      sku: 'COR-TPE-5X8-6',
      brand: 'CorrectIt',
      price: 9.50,
      currency: 'USD',
      stock: 180,
      thumbnail: 'https://placehold.co/100x100/f5f4f2/4a5568?text=Correction',
      reason: 'Complements writing instruments',
      category: 'desk',
    },
    {
      id: 'rec-4',
      name: 'Desk Pad - A2 Leather (Brown)',
      sku: 'DSK-PAD-A2-LB',
      brand: 'EcoDesk',
      price: 18.00,
      currency: 'USD',
      stock: 25,
      thumbnail: 'https://placehold.co/100x100/f5f4f2/4a5568?text=Desk+Pad',
      reason: 'Professional writing surface',
      category: 'desk',
    },
  ],
  'organization': [
    {
      id: 'rec-5',
      name: 'Label Maker Tape - 12mm (3 Pack)',
      sku: 'LBL-TPE-12-3',
      brand: 'LabelPro',
      price: 15.00,
      currency: 'USD',
      stock: 60,
      thumbnail: 'https://placehold.co/100x100/f5f4f2/4a5568?text=Labels',
      reason: 'Essential for filing organization',
      category: 'organization',
    },
  ],
  'desk': [
    {
      id: 'rec-6',
      name: 'Paper Shredder - Cross Cut',
      sku: 'SHR-CC-01',
      brand: 'SecureShred',
      price: 89.00,
      currency: 'USD',
      stock: 15,
      thumbnail: 'https://placehold.co/100x100/f5f4f2/4a5568?text=Shredder',
      reason: 'Document security for desk supplies',
      category: 'technology',
    },
  ],
}

function ProcurementRecommendations({
  rfqItems,
  onAddToRfq,
  className,
}: ProcurementRecommendationsProps) {
  const [expanded, setExpanded] = React.useState(false)

  const categories = new Set(rfqItems.map((i) => i.category).filter(Boolean))
  const recommendations = Array.from(categories).flatMap(
    (cat) => recommendationRules[cat as string] || [],
  )

  const uniqueRecommendations = recommendations.filter(
    (rec, index, self) => index === self.findIndex((r) => r.id === rec.id),
  )

  if (uniqueRecommendations.length === 0) return null

  return (
    <div className={cn('rounded-lg border border-primary/20 bg-primary-muted/30', className)}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-primary">Complementary Products</h3>
            <p className="text-xs text-text-muted">
              {uniqueRecommendations.length} suggestions based on your RFQ
            </p>
          </div>
        </div>
        <ChevronRight
          className={cn(
            'h-4 w-4 text-text-muted transition-transform',
            expanded && 'rotate-90',
          )}
        />
      </button>

      {expanded && (
        <div className="border-t border-primary/10 px-4 pb-4 space-y-2">
          {uniqueRecommendations.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3"
            >
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-surface-active">
                <img
                  src={product.thumbnail}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">{product.name}</p>
                <p className="text-xs text-text-muted">{product.reason}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
                  <span>SKU: {product.sku}</span>
                  <span>&middot;</span>
                  <span
                    className={cn(
                      product.stock === 0 ? 'text-destructive' : product.stock <= 5 ? 'text-warning' : 'text-success',
                    )}
                  >
                    {product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className="text-sm font-semibold text-text">
                  {formatCurrency(product.price, product.currency)}
                </span>
                {onAddToRfq && product.stock > 0 && (
                  <button
                    onClick={() => onAddToRfq(product)}
                    className="flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    Add
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { ProcurementRecommendations }
export type { RecommendedProduct }
