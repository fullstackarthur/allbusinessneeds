import { Link } from 'react-router-dom'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { EmptyState } from '@/shared/components/ui/empty-state'
import { formatCurrency } from '@/core/utils/helpers'
import { ROUTES } from '@/core/constants'
import type { RfqStatus } from '@/core/types/rfq-schemas'
import { RFQ_STATUS_LABELS, RFQ_STATUS_COLORS } from '@/core/types/rfq-schemas'
import {
  FileText,
  Clock,
  Mail,
  Download,
  Eye,
  Plus,
} from 'lucide-react'

interface RfqHistoryItem {
  id: string
  reference: string
  status: RfqStatus
  itemCount: number
  categories: string[]
  estimatedTotal?: number
  submittedAt: string
  respondedAt?: string
  completedAt?: string
  notes?: string
}

const mockHistory: RfqHistoryItem[] = [
  {
    id: '1',
    reference: 'RFQ-2024-001',
    status: 'quoted',
    itemCount: 5,
    categories: ['Paper & Printing', 'Writing Instruments'],
    estimatedTotal: 245.50,
    submittedAt: '2024-01-15T10:30:00Z',
    respondedAt: '2024-01-16T14:20:00Z',
  },
  {
    id: '2',
    reference: 'RFQ-2024-002',
    status: 'awaiting_quotation',
    itemCount: 3,
    categories: ['Desk Accessories'],
    submittedAt: '2024-01-18T09:00:00Z',
  },
  {
    id: '3',
    reference: 'RFQ-2024-003',
    status: 'completed',
    itemCount: 8,
    categories: ['Paper & Printing', 'Filing & Organization', 'Technology'],
    estimatedTotal: 512.00,
    submittedAt: '2024-01-10T11:00:00Z',
    respondedAt: '2024-01-11T16:00:00Z',
    completedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '4',
    reference: 'RFQ-2024-004',
    status: 'negotiating',
    itemCount: 12,
    categories: ['Paper & Printing', 'Writing Instruments', 'Desk Accessories'],
    estimatedTotal: 890.00,
    submittedAt: '2024-01-20T08:00:00Z',
    respondedAt: '2024-01-21T12:00:00Z',
  },
  {
    id: '5',
    reference: 'RFQ-2024-005',
    status: 'rejected',
    itemCount: 2,
    categories: ['Technology'],
    estimatedTotal: 150.00,
    submittedAt: '2024-01-05T14:00:00Z',
    respondedAt: '2024-01-06T09:00:00Z',
  },
]

function RfqHistoryPage() {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return formatDate(dateStr)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text">RFQ History</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Track and manage your procurement requests
          </p>
        </div>
        <Link to="/rfq/review">
          <Button size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            New RFQ
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-2xl font-semibold text-text">{mockHistory.length}</p>
          <p className="text-xs text-text-muted">Total RFQs</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-2xl font-semibold text-text">
            {mockHistory.filter((r) => ['awaiting_quotation', 'submitted'].includes(r.status)).length}
          </p>
          <p className="text-xs text-text-muted">Pending</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-2xl font-semibold text-text">
            {mockHistory.filter((r) => r.status === 'quoted').length}
          </p>
          <p className="text-xs text-text-muted">Quoted</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-2xl font-semibold text-text">
            {mockHistory.filter((r) => r.status === 'completed').length}
          </p>
          <p className="text-xs text-text-muted">Completed</p>
        </div>
      </div>

      {/* RFQ List */}
      {mockHistory.length === 0 ? (
        <EmptyState
          title="No RFQ history"
          description="Your procurement requests will appear here"
          icon={<FileText className="h-8 w-8" />}
          action={
            <Link to={ROUTES.HOME}>
              <Button>
                <Plus className="mr-1.5 h-4 w-4" />
                Create First RFQ
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {mockHistory.map((rfq) => (
            <div
              key={rfq.id}
              className="rounded-lg border border-border bg-surface p-4 transition-colors hover:border-border-strong"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-mono font-medium text-text">{rfq.reference}</p>
                    <Badge variant={RFQ_STATUS_COLORS[rfq.status] as 'default' | 'success' | 'secondary' | 'warning' | 'destructive'}>
                      {RFQ_STATUS_LABELS[rfq.status]}
                    </Badge>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
                    <span>{rfq.itemCount} items</span>
                    <span>&middot;</span>
                    <span>{rfq.categories.join(', ')}</span>
                    {rfq.estimatedTotal && (
                      <>
                        <span>&middot;</span>
                        <span>{formatCurrency(rfq.estimatedTotal)}</span>
                      </>
                    )}
                  </div>

                  <div className="mt-2 flex items-center gap-4 text-xs text-text-muted">
                    <span>Submitted: {formatTimeAgo(rfq.submittedAt)}</span>
                    {rfq.respondedAt && (
                      <span>Responded: {formatDate(rfq.respondedAt)}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    className="rounded-md p-2 text-text-muted hover:bg-surface-hover hover:text-text transition-colors"
                    aria-label="View RFQ details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    className="rounded-md p-2 text-text-muted hover:bg-surface-hover hover:text-text transition-colors"
                    aria-label="Download RFQ summary"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  {rfq.status === 'quoted' && (
                    <button
                      className="rounded-md p-2 text-text-muted hover:bg-surface-hover hover:text-text transition-colors"
                      aria-label="View quotation"
                    >
                      <Mail className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Timeline indicator for active RFQs */}
              {['submitted', 'awaiting_quotation'].includes(rfq.status) && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Expected response within 24-48 hours</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { RfqHistoryPage }
