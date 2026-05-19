import { Link } from 'react-router-dom'
import { cn } from '@/shared/lib/utils'
import { ROUTES } from '@/core/constants'
import { useRfqDraftStore } from '@/presentation/stores/rfq-draft-store'
import { Button } from '@/shared/components/ui/button'
import { FileText, ChevronRight } from 'lucide-react'

function RfqReviewBar() {
  const draft = useRfqDraftStore((state) => state.draft)
  const isOpen = useRfqDraftStore((state) => state.isOpen)
  const setOpen = useRfqDraftStore((state) => state.setOpen)

  const itemCount = draft?.items.length || 0

  if (itemCount === 0 && !isOpen) return null

  return (
    <div
      className={cn(
        'fixed bottom-16 left-0 right-0 z-30 border-t border-border bg-surface px-4 py-3 shadow-lg transition-transform duration-200 lg:bottom-0',
        isOpen ? 'translate-y-0' : 'translate-y-full',
      )}
    >
      <div className="container-safe flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-muted">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-text">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in RFQ draft
            </p>
            <p className="text-xs text-text-muted">Review and submit for quotation</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
            className="hidden sm:inline-flex"
          >
            Dismiss
          </Button>
          <Link to={ROUTES.RFQS}>
            <Button size="sm">
              Review
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export { RfqReviewBar }
