import { Link } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { EmptyState } from '@/shared/components/ui/empty-state'
import { formatCurrency } from '@/core/utils/helpers'
import { FileText, Plus, Eye } from 'lucide-react'

interface RfqItem {
  id: string
  reference: string
  status: 'draft' | 'submitted' | 'reviewing' | 'quoted' | 'accepted' | 'rejected'
  items: number
  createdAt: string
  total?: number
}

const mockRfqs: RfqItem[] = [
  { id: '1', reference: 'RFQ-2024-001', status: 'quoted', items: 5, createdAt: '2024-01-15', total: 245.50 },
  { id: '2', reference: 'RFQ-2024-002', status: 'submitted', items: 3, createdAt: '2024-01-18' },
  { id: '3', reference: 'RFQ-2024-003', status: 'accepted', items: 8, createdAt: '2024-01-10', total: 512.00 },
]

const statusVariant: Record<RfqItem['status'], 'default' | 'success' | 'warning' | 'destructive' | 'secondary'> = {
  draft: 'secondary',
  submitted: 'default',
  reviewing: 'warning',
  quoted: 'success',
  accepted: 'success',
  rejected: 'destructive',
}

function RfqsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text">Request for Quotations</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage your RFQs and supplier quotations
          </p>
        </div>
        <Button size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          New RFQ
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {mockRfqs.length === 0 ? (
            <EmptyState
              title="No RFQs yet"
              description="Create your first RFQ to start receiving quotations from suppliers"
              icon={<FileText className="h-8 w-8" />}
              action={
                <Button>
                  <Plus className="mr-1.5 h-4 w-4" />
                  Create RFQ
                </Button>
              }
            />
          ) : (
            <div className="space-y-2">
              {mockRfqs.map((rfq) => (
                <div
                  key={rfq.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface p-4 transition-colors hover:border-border-strong"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-muted">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text">{rfq.reference}</p>
                      <p className="mt-0.5 text-xs text-text-muted">
                        {rfq.items} items &middot; {rfq.createdAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {rfq.total && (
                      <span className="text-sm font-medium text-text">
                        {formatCurrency(rfq.total)}
                      </span>
                    )}
                    <Badge variant={statusVariant[rfq.status]}>
                      {rfq.status}
                    </Badge>
                    <Link to={`/rfqs/${rfq.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          <EmptyState title="No active RFQs" description="All your RFQs have been completed" />
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <EmptyState title="No completed RFQs" description="Completed RFQs will appear here" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export { RfqsPage }
