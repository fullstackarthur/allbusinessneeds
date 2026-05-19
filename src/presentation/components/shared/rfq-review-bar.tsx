import { useRfqDraftStore } from '@/presentation/stores/rfq-draft-store'
import { useRfqWorkflowStore } from '@/presentation/stores/rfq-workflow-store'
import { Button } from '@/shared/components/ui/button'
import { FileText, ChevronRight, X, Minus } from 'lucide-react'
import { formatCurrency } from '@/core/utils/helpers'

function RfqReviewBar() {
  const draft = useRfqDraftStore((state) => state.draft)
  const isOpen = useRfqDraftStore((state) => state.isOpen)
  const setOpen = useRfqDraftStore((state) => state.setOpen)
  const removeItem = useRfqDraftStore((state) => state.removeItem)
  const workflowItems = useRfqWorkflowStore((state) => state.items)
  const setStep = useRfqWorkflowStore((state) => state.setStep)

  const items = draft?.items || []
  const itemCount = items.length
  const estimatedTotal = items.reduce((sum, item) => {
    return sum + (item.targetPrice || 0) * item.quantity
  }, 0)

  const hasWorkflowItems = workflowItems.length > 0
  const displayCount = hasWorkflowItems ? workflowItems.length : itemCount

  if (displayCount === 0 && !isOpen) return null

  const workflowItemMap = new Map(workflowItems.map((i) => [i.product_id, i]))

  return (
    <>
      {/* Collapsed Bar */}
      {!isOpen && displayCount > 0 && (
        <button
          onClick={() => {
            setOpen(true)
          }}
          className="fixed bottom-16 left-3 right-3 z-30 flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 shadow-lg lg:bottom-4 lg:left-auto lg:right-6 lg:w-80"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-text">
                {displayCount} {displayCount === 1 ? 'item' : 'items'}
              </p>
              <p className="text-xs text-text-muted">Tap to review RFQ</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-text-muted" />
        </button>
      )}

      {/* Expanded Drawer */}
      {isOpen && displayCount > 0 && (
        <div className="fixed inset-0 z-50 lg:pointer-events-none">
          <div
            className="absolute inset-0 bg-overlay lg:hidden"
            onClick={() => setOpen(false)}
          />

          <div className="absolute bottom-16 left-0 right-0 lg:bottom-0 lg:left-auto lg:right-0 lg:top-0 lg:w-96 lg:border-l lg:border-border">
            <div className="flex max-h-[70vh] flex-col rounded-t-xl border border-border bg-surface shadow-xl lg:max-h-full lg:rounded-none">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <FileText className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text">RFQ Draft</p>
                    <p className="text-xs text-text-muted">{displayCount} items</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-md p-1.5 text-text-muted hover:bg-surface-hover hover:text-text transition-colors"
                  aria-label="Close RFQ drawer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ maxHeight: '40vh' }}>
                {items.map((item) => {
                  const workflowItem = workflowItemMap.get(item.productId)
                  const quantity = workflowItem?.quantity || item.quantity

                  return (
                    <div
                      key={item.productId}
                      className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text truncate">
                          {item.productName}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
                          <span>Qty: {quantity}</span>
                          {item.targetPrice && (
                            <>
                              <span>&middot;</span>
                              <span>{formatCurrency(item.targetPrice)}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="rounded-md p-1.5 text-text-muted hover:bg-destructive-muted hover:text-destructive transition-colors"
                        aria-label={`Remove ${item.productName}`}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="border-t border-border px-4 py-3 safe-bottom space-y-2">
                {estimatedTotal > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Estimated total</span>
                    <span className="font-semibold text-text">
                      {formatCurrency(estimatedTotal)}
                    </span>
                  </div>
                )}
                <Button
                  onClick={() => {
                    setOpen(false)
                    setStep('review')
                  }}
                  className="w-full"
                >
                  Review & Submit
                  <ChevronRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export { RfqReviewBar }
