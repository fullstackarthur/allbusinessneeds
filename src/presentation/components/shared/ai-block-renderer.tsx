import type { AiResponseBlock, AiProduct, AiQuantityRecommendation, AiProcurementBundle, AiInventoryAlert, AiClarificationRequest, AiRfqSummary, AiSpecificationSummary } from '@/core/types/ai-schemas'
import { formatCurrency } from '@/core/utils/helpers'
import { AlertCircle, Package, TrendingUp, FileText, HelpCircle, ClipboardList, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

function TextBlock({ content }: { content: string }) {
  return (
    <p className="text-sm text-text-secondary leading-relaxed">
      {content}
    </p>
  )
}

function ProductRecommendationsBlock({
  title,
  products,
  context,
  onAddToRfq,
}: {
  title?: string
  products: AiProduct[]
  context?: string
  onAddToRfq?: (product: AiProduct) => void
}) {
  return (
    <div className="space-y-3">
      {title && (
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-medium text-text">{title}</h4>
        </div>
      )}
      {context && (
        <p className="text-xs text-text-muted">{context}</p>
      )}
      <div className="space-y-2">
        {products.map((product) => (
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
              <div className="mt-0.5 flex items-center gap-2 text-xs text-text-muted">
                <span>SKU: {product.sku}</span>
                {product.brand && (
                  <>
                    <span>&middot;</span>
                    <span>{product.brand}</span>
                  </>
                )}
              </div>
              {product.reason && (
                <p className="mt-1 text-xs text-text-secondary">{product.reason}</p>
              )}
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="text-sm font-semibold text-text">
                {formatCurrency(product.price, product.currency)}
              </span>
              <span className={cn(
                'text-xs',
                product.stock === 0 ? 'text-destructive' : product.stock <= 5 ? 'text-warning' : 'text-success',
              )}>
                {product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`}
              </span>
              {onAddToRfq && product.stock > 0 && (
                <button
                  onClick={() => onAddToRfq(product)}
                  className="rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                >
                  Add to RFQ
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function QuantityRecommendationsBlock({
  recommendations,
  context,
}: {
  recommendations: AiQuantityRecommendation[]
  context?: string
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-medium text-text">Quantity Recommendations</h4>
      </div>
      {context && (
        <p className="text-xs text-text-muted">{context}</p>
      )}
      <div className="space-y-2">
        {recommendations.map((rec) => (
          <div
            key={rec.product_id}
            className="flex items-center justify-between rounded-lg border border-border bg-surface p-3"
          >
            <div>
              <p className="text-sm font-medium text-text">{rec.product_name}</p>
              {rec.reasoning && (
                <p className="mt-0.5 text-xs text-text-secondary">{rec.reasoning}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-primary-muted px-2.5 py-1 text-sm font-semibold text-primary">
                {rec.recommended_quantity} {rec.unit || 'units'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProcurementBundleBlock({
  bundle,
  onAddAllToRfq,
}: {
  bundle: AiProcurementBundle
  onAddAllToRfq?: (products: AiProduct[]) => void
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ClipboardList className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-medium text-text">{bundle.title}</h4>
      </div>
      <p className="text-xs text-text-secondary">{bundle.description}</p>

      <div className="space-y-2">
        {bundle.products.map((product) => (
          <div key={product.id} className="flex items-center gap-3 rounded-md border border-border bg-surface p-2.5">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-surface-active">
              <img src={product.thumbnail} alt={product.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text truncate">{product.name}</p>
              <p className="text-xs text-text-muted">{formatCurrency(product.price, product.currency)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-md bg-surface-active px-3 py-2">
        <span className="text-sm font-medium text-text">Estimated total</span>
        <span className="text-base font-semibold text-text">
          {formatCurrency(bundle.estimated_total)}
        </span>
      </div>

      {bundle.savings_note && (
        <p className="text-xs text-success">{bundle.savings_note}</p>
      )}

      {onAddAllToRfq && (
        <button
          onClick={() => onAddAllToRfq(bundle.products)}
          className="w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
        >
          Add Bundle to RFQ
        </button>
      )}
    </div>
  )
}

function InventoryAlertBlock({ alert }: { alert: AiInventoryAlert }) {
  const iconMap = {
    low_stock: <AlertTriangle className="h-4 w-4 text-warning" />,
    out_of_stock: <AlertCircle className="h-4 w-4 text-destructive" />,
    price_change: <TrendingUp className="h-4 w-4 text-primary" />,
    discontinued: <AlertCircle className="h-4 w-4 text-destructive" />,
  }

  const colorMap = {
    low_stock: 'border-warning/30 bg-warning-muted',
    out_of_stock: 'border-destructive/30 bg-destructive-muted',
    price_change: 'border-primary/30 bg-primary-muted',
    discontinued: 'border-destructive/30 bg-destructive-muted',
  }

  return (
    <div className={cn('rounded-lg border p-3', colorMap[alert.alert_type])}>
      <div className="flex items-start gap-2">
        {iconMap[alert.alert_type]}
        <div className="flex-1">
          <p className="text-sm font-medium text-text">{alert.product_name}</p>
          <p className="mt-0.5 text-xs text-text-secondary">{alert.message}</p>
          {alert.action_suggested && (
            <p className="mt-1 text-xs font-medium text-text">{alert.action_suggested}</p>
          )}
        </div>
      </div>
    </div>
  )
}

function ClarificationBlock({
  request,
  onRespond,
}: {
  request: AiClarificationRequest
  onRespond?: (answer: string) => void
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-medium text-text">Clarification Needed</h4>
      </div>
      <p className="text-sm text-text-secondary">{request.question}</p>
      {request.options && request.options.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {request.options.map((option) => (
            <button
              key={option}
              onClick={() => onRespond?.(option)}
              className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-hover hover:text-text transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function RfqSummaryBlock({ summary }: { summary: AiRfqSummary }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-medium text-text">RFQ Summary</h4>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md bg-surface-active p-3 text-center">
          <p className="text-lg font-semibold text-text">{summary.item_count}</p>
          <p className="text-xs text-text-muted">Items</p>
        </div>
        <div className="rounded-md bg-surface-active p-3 text-center">
          <p className="text-lg font-semibold text-text">{formatCurrency(summary.estimated_total)}</p>
          <p className="text-xs text-text-muted">Estimated</p>
        </div>
      </div>

      {summary.categories.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {summary.categories.map((cat) => (
            <span key={cat} className="rounded-full bg-primary-muted px-2 py-0.5 text-xs text-primary">
              {cat}
            </span>
          ))}
        </div>
      )}

      {summary.notes && (
        <p className="text-xs text-text-secondary">{summary.notes}</p>
      )}

      {summary.suggestions && summary.suggestions.length > 0 && (
        <div className="space-y-1">
          {summary.suggestions.map((suggestion, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-text-secondary">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success mt-0.5" />
              <span>{suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SpecificationSummaryBlock({ spec }: { spec: AiSpecificationSummary }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ClipboardList className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-medium text-text">{spec.product_name}</h4>
      </div>

      <div className="rounded-lg border border-border bg-surface overflow-hidden">
        {spec.key_specs.map((s, i) => (
          <div
            key={s.label}
            className={cn(
              'flex items-center px-3 py-2',
              i !== 0 && 'border-t border-border',
            )}
          >
            <span className="w-28 text-xs text-text-muted">{s.label}</span>
            <span className="text-xs font-medium text-text">{s.value}</span>
          </div>
        ))}
      </div>

      {spec.compliance_notes && spec.compliance_notes.length > 0 && (
        <div className="space-y-1">
          {spec.compliance_notes.map((note, i) => (
            <p key={i} className="text-xs text-text-secondary">{note}</p>
          ))}
        </div>
      )}
    </div>
  )
}

interface AiBlockRendererProps {
  block: AiResponseBlock
  onAddToRfq?: (product: AiProduct) => void
  onAddAllToRfq?: (products: AiProduct[]) => void
  onClarificationResponse?: (answer: string) => void
}

function AiBlockRenderer({ block, onAddToRfq, onAddAllToRfq, onClarificationResponse }: AiBlockRendererProps) {
  switch (block.type) {
    case 'text':
      return <TextBlock content={block.content} />

    case 'product_recommendations':
      return (
        <ProductRecommendationsBlock
          title={block.title}
          products={block.products}
          context={block.context}
          onAddToRfq={onAddToRfq}
        />
      )

    case 'quantity_recommendations':
      return <QuantityRecommendationsBlock recommendations={block.recommendations} context={block.context} />

    case 'procurement_bundle':
      return (
        <ProcurementBundleBlock
          bundle={block.bundle}
          onAddAllToRfq={onAddAllToRfq}
        />
      )

    case 'inventory_alert':
      return <InventoryAlertBlock alert={block.alert} />

    case 'clarification':
      return (
        <ClarificationBlock
          request={block.request}
          onRespond={onClarificationResponse}
        />
      )

    case 'rfq_summary':
      return <RfqSummaryBlock summary={block.summary} />

    case 'specification_summary':
      return <SpecificationSummaryBlock spec={block.spec} />

    default:
      return null
  }
}

export { AiBlockRenderer }
export type { AiResponseBlock, AiProduct }
