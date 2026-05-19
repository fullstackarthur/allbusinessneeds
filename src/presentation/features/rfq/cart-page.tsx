import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { StepProgress, StepProgressMobile } from '@/shared/components/ui/step-progress'
import { useRfqWorkflowStore } from '@/presentation/stores/rfq-workflow-store'
import { useRfqDraftStore, EMPTY_ITEMS } from '@/presentation/stores/rfq-draft-store'
import { formatCurrency } from '@/core/utils/helpers'
import { ROUTES } from '@/core/constants'
import {
  ChevronRight,
  Minus,
  Plus,
  Trash2,
  FileText,
  ShoppingCart,
  Sparkles,
} from 'lucide-react'
import * as React from 'react'

const rfqSteps = [
  { id: 'cart', label: 'Cart', description: 'Review items' },
  { id: 'review', label: 'Review', description: 'Group & specify' },
  { id: 'details', label: 'Details', description: 'Contact info' },
  { id: 'confirmation', label: 'Submit', description: 'Confirmation' },
]

function RfqCartPage() {
  const addItem = useRfqWorkflowStore((state) => state.addItem)
  const removeItem = useRfqWorkflowStore((state) => state.removeItem)
  const updateQuantity = useRfqWorkflowStore((state) => state.updateQuantity)
  const setStep = useRfqWorkflowStore((state) => state.setStep)
  const getEstimatedTotal = useRfqWorkflowStore((state) => state.getEstimatedTotal)
  const draftItems = useRfqDraftStore((state) => state.draft?.items ?? EMPTY_ITEMS)
  const workflowItems = useRfqWorkflowStore((state) => state.items)

  const syncedRef = React.useRef<string>('')

  React.useEffect(() => {
    if (draftItems.length === 0) return

    const key = draftItems.map((i) => `${i.productId}:${i.quantity}`).join(',')
    if (syncedRef.current === key) return
    syncedRef.current = key

    const workflowIds = new Set(useRfqWorkflowStore.getState().items.map((i) => i.product_id))

    draftItems.forEach((item) => {
      if (!workflowIds.has(item.productId)) {
        addItem({
          id: item.productId,
          product_id: item.productId,
          product_name: item.productName,
          quantity: item.quantity,
          target_price: item.targetPrice,
          specifications: item.specifications,
          sku: undefined,
          brand: undefined,
          thumbnail: undefined,
          category: undefined,
          notes: undefined,
        })
      }
    })
  }, [draftItems, addItem])

  const items = workflowItems.length > 0 ? workflowItems : draftItems.map((item) => ({
    id: item.productId,
    product_id: item.productId,
    product_name: item.productName,
    quantity: item.quantity,
    target_price: item.targetPrice,
    specifications: item.specifications,
  }))

  const estimatedTotal = getEstimatedTotal()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-text">Request for Quotation</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Review your items and submit for supplier quotations
        </p>
      </div>

      {/* Step Progress */}
      <div className="hidden sm:block">
        <StepProgress steps={rfqSteps} currentStep="cart" />
      </div>
      <div className="sm:hidden">
        <StepProgressMobile steps={rfqSteps} currentStep="cart" />
      </div>

      {/* Cart Items */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-active">
            <ShoppingCart className="h-7 w-7 text-text-muted" />
          </div>
          <h2 className="text-lg font-semibold text-text">Your RFQ is empty</h2>
          <p className="mt-1 text-sm text-text-secondary max-w-sm">
            Browse our catalog and add products to request quotations from suppliers
          </p>
          <Link to={ROUTES.HOME} className="mt-4">
            <Button>Browse Catalog</Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Item Count Bar */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-muted">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-text">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </p>
                <p className="text-xs text-text-muted">Ready for quotation</p>
              </div>
            </div>
            {estimatedTotal > 0 && (
              <p className="text-sm font-semibold text-text">
                Est. {formatCurrency(estimatedTotal)}
              </p>
            )}
          </div>

          {/* Items List */}
          <div className="space-y-2">
            {items.map((item) => {
              const lineTotal = (item.target_price || 0) * item.quantity

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text truncate">
                      {item.product_name}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
                      {item.specifications && (
                        <span className="line-clamp-1">{item.specifications}</span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1 rounded-md border border-border bg-surface shrink-0">
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
                  <div className="hidden sm:block text-right min-w-[80px] shrink-0">
                    {item.target_price ? (
                      <>
                        <p className="text-sm font-semibold text-text">
                          {formatCurrency(lineTotal)}
                        </p>
                        <p className="text-xs text-text-muted">
                          {formatCurrency(item.target_price)} / unit
                        </p>
                      </>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Price TBD
                      </Badge>
                    )}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="rounded-md p-2 text-text-muted hover:bg-destructive-muted hover:text-destructive transition-colors shrink-0"
                    aria-label={`Remove ${item.product_name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )
            })}
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
                Add More Items
              </Button>
            </Link>
            <Button onClick={() => setStep('review')} className="flex-1">
              Continue to Review
              <ChevronRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export { RfqCartPage }
