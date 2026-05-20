import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { useRfqWorkflowStore } from '@/presentation/stores/rfq-workflow-store'
import { formatCurrency } from '@/core/utils/helpers'
import { ROUTES } from '@/core/constants'
import {
  CheckCircle2,
  Mail,
  Download,
  Clock,
  Building2,
  MapPin,
  Copy,
} from 'lucide-react'
import * as React from 'react'

function RfqConfirmationPage() {
  const reference = useRfqWorkflowStore((state) => state.reference)
  const items = useRfqWorkflowStore((state) => state.items)
  const contact = useRfqWorkflowStore((state) => state.contact)
  const delivery = useRfqWorkflowStore((state) => state.delivery)
  const notes = useRfqWorkflowStore((state) => state.notes)
  const urgency = useRfqWorkflowStore((state) => state.urgency)
  const budgetRange = useRfqWorkflowStore((state) => state.budgetRange)
  const submittedAt = useRfqWorkflowStore((state) => state.submittedAt)
  const reset = useRfqWorkflowStore((state) => state.reset)
  const getEstimatedTotal = useRfqWorkflowStore((state) => state.getEstimatedTotal)
  const getCategories = useRfqWorkflowStore((state) => state.getCategories)

  const [copied, setCopied] = React.useState(false)

  const estimatedTotal = getEstimatedTotal()
  const categories = getCategories()

  const handleCopyReference = () => {
    if (reference) {
      navigator.clipboard.writeText(reference)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownloadSummary = () => {
    const summary = generateSummaryText()
    const blob = new Blob([summary], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${reference || 'RFQ'}-summary.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const generateSummaryText = () => {
    let text = `RFQ SUMMARY\n${'='.repeat(40)}\n\n`
    text += `Reference: ${reference}\n`
    text += `Date: ${submittedAt ? new Date(submittedAt).toLocaleDateString() : 'N/A'}\n`
    text += `Status: Submitted\n`
    text += `Urgency: ${urgency}\n\n`

    text += `CONTACT\n${'-'.repeat(40)}\n`
    if (contact) {
      text += `Name: ${contact.full_name}\n`
      text += `Email: ${contact.email}\n`
      text += `Phone: ${contact.phone}\n`
      text += `Company: ${contact.company}\n`
      if (contact.job_title) text += `Title: ${contact.job_title}\n`
      if (contact.department) text += `Department: ${contact.department}\n`
    }
    text += '\n'

    text += `ITEMS (${items.length})\n${'-'.repeat(40)}\n`
    items.forEach((item, i) => {
      text += `${i + 1}. ${item.product_name}\n`
      text += `   SKU: ${item.sku || 'N/A'}\n`
      text += `   Quantity: ${item.quantity}\n`
      if (item.unit_price || item.target_price) {
        text += `   Unit Price: ${formatCurrency(item.unit_price || item.target_price || 0)}\n`
      }
      if (item.specifications) text += `   Specs: ${item.specifications}\n`
      text += '\n'
    })

    text += `ESTIMATED TOTAL: ${formatCurrency(estimatedTotal)}\n`

    if (notes) {
      text += `\nNOTES\n${'-'.repeat(40)}\n${notes}\n`
    }

    return text
  }

  const urgencyColors = {
    standard: 'default',
    urgent: 'warning',
    critical: 'destructive',
  } as const

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Success Header */}
      <div className="text-center py-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-muted">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <h1 className="mt-4 text-xl font-semibold text-text">RFQ Submitted Successfully</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Your procurement request has been received and is being processed
        </p>
      </div>

      {/* Reference Number */}
      <div className="rounded-lg border border-border bg-surface p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-text-muted">Reference Number</p>
            <p className="mt-1 text-lg font-mono font-semibold text-text">{reference}</p>
          </div>
          <button
            onClick={handleCopyReference}
            className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-secondary hover:bg-surface-hover transition-colors"
          >
            <Copy className="h-4 w-4" />
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-lg border border-border bg-surface p-4">
        <h3 className="text-sm font-semibold text-text mb-4">What happens next</h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-muted">
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-text">RFQ Received</p>
              <p className="text-xs text-text-muted">
                {submittedAt ? new Date(submittedAt).toLocaleString() : 'Just now'}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-active">
              <Clock className="h-4 w-4 text-text-muted" />
            </div>
            <div>
              <p className="text-sm font-medium text-text">Quotation Preparation</p>
              <p className="text-xs text-text-muted">Our team is reviewing your requirements</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-active">
              <Mail className="h-4 w-4 text-text-muted" />
            </div>
            <div>
              <p className="text-sm font-medium text-text">Quotation Delivery</p>
              <p className="text-xs text-text-muted">You will receive a quotation at {contact?.email || 'your email'} within 24-48 hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* RFQ Summary */}
      <div className="rounded-lg border border-border bg-surface p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text">RFQ Summary</h3>
          <Badge variant={urgencyColors[urgency]} className="capitalize">{urgency}</Badge>
        </div>

        {/* Items */}
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">{item.product_name}</p>
                <p className="text-xs text-text-muted">
                  Qty: {item.quantity}
                  {item.sku && ` • SKU: ${item.sku}`}
                </p>
              </div>
              {(item.unit_price || item.target_price) && (
                <span className="text-sm font-medium text-text">
                  {formatCurrency((item.unit_price || item.target_price || 0) * item.quantity)}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <Badge key={cat} variant="secondary">{cat}</Badge>
            ))}
          </div>
        )}

        {/* Estimated Total */}
        {estimatedTotal > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-sm font-medium text-text-secondary">Estimated Total</span>
            <span className="text-lg font-semibold text-text">{formatCurrency(estimatedTotal)}</span>
          </div>
        )}

        {/* Budget */}
        {budgetRange && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Budget Range</span>
            <span className="font-medium text-text">{budgetRange}</span>
          </div>
        )}

        {/* Notes */}
        {notes && (
          <div>
            <p className="text-xs font-medium text-text-secondary mb-1">Notes</p>
            <p className="text-sm text-text-secondary">{notes}</p>
          </div>
        )}
      </div>

      {/* Contact Details */}
      {contact && (
        <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
          <h3 className="text-sm font-semibold text-text">Contact Information</h3>

          <div className="flex items-center gap-3">
            <Building2 className="h-4 w-4 text-text-muted" />
            <div>
              <p className="text-sm font-medium text-text">{contact.company}</p>
              <p className="text-xs text-text-muted">{contact.full_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-text-secondary">
            <Mail className="h-4 w-4 text-text-muted" />
            <span>{contact.email}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-text-secondary">
            <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>{contact.phone}</span>
          </div>

          {delivery && (
            <div className="flex items-start gap-3 text-sm text-text-secondary">
              <MapPin className="h-4 w-4 text-text-muted mt-0.5" />
              <div>
                <p>{delivery.address_line1}</p>
                {delivery.address_line2 && <p>{delivery.address_line2}</p>}
                <p>{delivery.city}{delivery.state ? `, ${delivery.state}` : ''} {delivery.postal_code}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={handleDownloadSummary} className="gap-2">
            <Download className="h-4 w-4" />
            Download Summary
          </Button>
          <Button variant="outline" className="gap-2">
            <Mail className="h-4 w-4" />
            Email Copy
          </Button>
        </div>

        <Link to={ROUTES.EXPERIENCE_HOME}>
          <Button className="w-full">
            Continue Sourcing
          </Button>
        </Link>

        <button
          onClick={reset}
          className="w-full text-sm text-text-muted hover:text-text transition-colors"
        >
          Start New RFQ
        </button>
      </div>
    </div>
  )
}

export { RfqConfirmationPage }
