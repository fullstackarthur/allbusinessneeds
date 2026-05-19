import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Input } from '@/shared/components/ui/input'
import { useRfqWorkflowStore } from '@/presentation/stores/rfq-workflow-store'
import { useRfqDraftStore } from '@/presentation/stores/rfq-draft-store'
import { formatCurrency } from '@/core/utils/helpers'
import { ROUTES } from '@/core/constants'
import {
  ChevronRight,
  Minus,
  Plus,
  Trash2,
  FileText,
  ArrowLeft,
  Sparkles,
} from 'lucide-react'
import * as React from 'react'

function RfqReviewPage() {
  const draftItems = useRfqDraftStore((state) => state.draft?.items || [])
  const addItem = useRfqWorkflowStore((state) => state.addItem)
  const workflowItems = useRfqWorkflowStore((state) => state.items)

  React.useEffect(() => {
    if (draftItems.length === 0) return
    const workflowIds = new Set(workflowItems.map((i) => i.product_id))
    draftItems.forEach((item) => {
      if (!workflowIds.has(item.productId)) {
        addItem({
          id: item.productId,
          product_id: item.productId,
          product_name: item.productName,
          quantity: item.quantity,
          target_price: item.targetPrice,
          specifications: item.specifications,
        })
      }
    })
  }, [draftItems, addItem, workflowItems])

  const items = useRfqWorkflowStore((state) => state.items)
  const notes = useRfqWorkflowStore((state) => state.notes)
  const urgency = useRfqWorkflowStore((state) => state.urgency)
  const budgetRange = useRfqWorkflowStore((state) => state.budgetRange)
  const setNotes = useRfqWorkflowStore((state) => state.setNotes)
  const setUrgency = useRfqWorkflowStore((state) => state.setUrgency)
  const setBudgetRange = useRfqWorkflowStore((state) => state.setBudgetRange)
  const updateQuantity = useRfqWorkflowStore((state) => state.updateQuantity)
  const removeItem = useRfqWorkflowStore((state) => state.removeItem)
  const setStep = useRfqWorkflowStore((state) => state.setStep)
  const getEstimatedTotal = useRfqWorkflowStore((state) => state.getEstimatedTotal)
  const getCategories = useRfqWorkflowStore((state) => state.getCategories)

  const estimatedTotal = getEstimatedTotal()
  const categories = getCategories()

  const groupedItems = items.reduce<Record<string, typeof items>>((acc, item) => {
    const category = item.category || 'Other'
    if (!acc[category]) acc[category] = []
    acc[category].push(item)
    return acc
  }, {})

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Link to={ROUTES.HOME} className="hover:text-text transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text">Review RFQ</span>
        </div>

        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-active">
            <FileText className="h-6 w-6 text-text-muted" />
          </div>
          <h2 className="text-lg font-semibold text-text">No items in RFQ</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Add products to your RFQ to request quotations
          </p>
          <Link to={ROUTES.HOME} className="mt-4">
            <Button>Browse Catalog</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link to={ROUTES.HOME} className="hover:text-text transition-colors">Home</Link>
        <span>/</span>
        <span className="text-text">Review RFQ</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text">Review RFQ</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {items.length} {items.length === 1 ? 'item' : 'items'} across {categories.length} {categories.length === 1 ? 'category' : 'categories'}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setStep('cart')}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to Cart
        </Button>
      </div>

      {/* Grouped Items */}
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <div key={category} className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="default">{category}</Badge>
            <span className="text-xs text-text-muted">{categoryItems.length} items</span>
          </div>

          <div className="space-y-2">
            {categoryItems.map((item) => {
              const lineTotal = (item.unit_price || item.target_price || 0) * item.quantity

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-surface-active">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.product_name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <FileText className="h-5 w-5 text-text-muted" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text truncate">{item.product_name}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
                      {item.sku && <span>SKU: {item.sku}</span>}
                      {item.brand && (
                        <>
                          <span>&middot;</span>
                          <span>{item.brand}</span>
                        </>
                      )}
                    </div>

                    {item.specifications && (
                      <p className="mt-1 text-xs text-text-secondary line-clamp-1">
                        {item.specifications}
                      </p>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1 rounded-md border border-border bg-surface">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
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
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center text-text-muted hover:text-text transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="hidden sm:block text-right min-w-[80px]">
                    {item.unit_price || item.target_price ? (
                      <>
                        <p className="text-sm font-semibold text-text">
                          {formatCurrency(lineTotal)}
                        </p>
                        <p className="text-xs text-text-muted">
                          {formatCurrency(item.unit_price || item.target_price || 0)} / unit
                        </p>
                      </>
                    ) : (
                      <p className="text-xs text-text-muted">Price TBD</p>
                    )}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="rounded-md p-2 text-text-muted hover:bg-destructive-muted hover:text-destructive transition-colors"
                    aria-label={`Remove ${item.product_name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* RFQ Details */}
      <div className="rounded-lg border border-border bg-surface p-4 space-y-4">
        <h3 className="text-sm font-semibold text-text">RFQ Details</h3>

        {/* Urgency */}
        <div>
          <label className="text-sm font-medium text-text">Urgency</label>
          <div className="mt-2 flex gap-2">
            {(['standard', 'urgent', 'critical'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setUrgency(level)}
                className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                  urgency === level
                    ? level === 'critical'
                      ? 'border-destructive bg-destructive-muted text-destructive'
                      : level === 'urgent'
                        ? 'border-warning bg-warning-muted text-warning'
                        : 'border-primary bg-primary-muted text-primary'
                    : 'border-border bg-surface text-text-secondary hover:bg-surface-hover'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Budget Range */}
        <div>
          <label htmlFor="budget" className="text-sm font-medium text-text">
            Budget Range <span className="text-text-muted font-normal">(optional)</span>
          </label>
          <Input
            id="budget"
            value={budgetRange}
            onChange={(e) => setBudgetRange(e.target.value)}
            placeholder="e.g., $500 - $1,000"
            className="mt-2"
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="text-sm font-medium text-text">
            Procurement Notes <span className="text-text-muted font-normal">(optional)</span>
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any specific requirements, delivery preferences, or special instructions..."
            rows={3}
            className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary resize-none"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-lg border border-border bg-surface p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Items</span>
            <span className="font-medium text-text">{items.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Categories</span>
            <span className="font-medium text-text">{categories.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Urgency</span>
            <span className="font-medium capitalize text-text">{urgency}</span>
          </div>
          {estimatedTotal > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Estimated Total</span>
              <span className="font-semibold text-text">{formatCurrency(estimatedTotal)}</span>
            </div>
          )}
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="rounded-lg border border-primary/20 bg-primary-muted/30 p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-primary">AI Sourcing Suggestions</h4>
            <p className="mt-1 text-xs text-text-secondary">
              Get intelligent recommendations for complementary products and cost-saving alternatives
            </p>
            <button className="mt-2 text-xs font-medium text-primary hover:text-primary-hover transition-colors">
              View suggestions
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link to={ROUTES.HOME} className="flex-1">
          <Button variant="outline" className="w-full">
            Continue Shopping
          </Button>
        </Link>
        <Button onClick={() => setStep('details')} className="flex-1">
          Continue to Details
          <ChevronRight className="ml-1.5 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export { RfqReviewPage }
