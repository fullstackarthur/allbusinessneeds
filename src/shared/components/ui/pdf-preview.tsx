import * as React from 'react'
import { formatCurrency } from '@/core/utils/helpers'
import type { RfqItem, RfqContact, RfqDelivery } from '@/core/types/rfq-schemas'
import { X, Download } from 'lucide-react'

interface PdfPreviewData {
  reference: string
  date: string
  items: RfqItem[]
  contact: RfqContact
  delivery?: RfqDelivery | null
  notes?: string
  urgency: string
  budgetRange?: string
  estimatedTotal: number
  categories: string[]
}

interface PdfPreviewModalProps {
  data: PdfPreviewData
  open: boolean
  onClose: () => void
}

function PdfPreviewModal({ data, open, onClose }: PdfPreviewModalProps) {
  const contentRef = React.useRef<HTMLDivElement>(null)

  const handleDownload = () => {
    const content = contentRef.current
    if (!content) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>RFQ ${data.reference}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 40px; color: #0a1628; line-height: 1.5; }
          .header { border-bottom: 2px solid #0033a0; padding-bottom: 16px; margin-bottom: 24px; }
          .header h1 { margin: 0; font-size: 18px; color: #0033a0; }
          .header p { margin: 4px 0 0; font-size: 12px; color: #718096; }
          .section { margin-bottom: 20px; }
          .section h2 { font-size: 14px; margin: 0 0 8px; color: #0a1628; border-bottom: 1px solid #e2e0dc; padding-bottom: 4px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
          .label { font-size: 11px; color: #718096; }
          .value { font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          th { text-align: left; font-size: 11px; color: #718096; border-bottom: 1px solid #e2e0dc; padding: 6px 8px; }
          td { font-size: 12px; padding: 8px; border-bottom: 1px solid #f5f4f2; }
          .total { text-align: right; font-size: 16px; font-weight: 600; margin-top: 16px; }
          .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e0dc; font-size: 10px; color: #718096; text-align: center; }
          @media print { body { margin: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>All Business Needs</h1>
          <p>Request for Quotation</p>
        </div>

        <div class="grid">
          <div class="section">
            <h2>Reference</h2>
            <p class="value">${data.reference}</p>
            <p class="label">${data.date}</p>
          </div>
          <div class="section">
            <h2>Urgency</h2>
            <p class="value" style="text-transform: capitalize">${data.urgency}</p>
            ${data.budgetRange ? `<p class="label">Budget: ${data.budgetRange}</p>` : ''}
          </div>
        </div>

        <div class="section">
          <h2>Contact Information</h2>
          <p class="value">${data.contact.full_name}</p>
          <p class="label">${data.contact.job_title || ''} ${data.contact.company}</p>
          <p class="label">${data.contact.email} | ${data.contact.phone}</p>
        </div>

        ${data.delivery ? `
        <div class="section">
          <h2>Delivery Address</h2>
          <p class="value">${data.delivery.address_line1}</p>
          ${data.delivery.address_line2 ? `<p class="value">${data.delivery.address_line2}</p>` : ''}
          <p class="value">${data.delivery.city}, ${data.delivery.state || ''} ${data.delivery.postal_code}</p>
        </div>
        ` : ''}

        <div class="section">
          <h2>Procurement Items (${data.items.length})</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>SKU</th>
                <th>Qty</th>
                <th style="text-align: right">Unit Price</th>
                <th style="text-align: right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${data.items.map((item, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${item.product_name}</td>
                  <td>${item.sku || '-'}</td>
                  <td>${item.quantity}</td>
                  <td style="text-align: right">${item.unit_price || item.target_price ? formatCurrency(item.unit_price || item.target_price || 0) : 'TBD'}</td>
                  <td style="text-align: right">${item.unit_price || item.target_price ? formatCurrency((item.unit_price || item.target_price || 0) * item.quantity) : 'TBD'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          ${data.estimatedTotal > 0 ? `<p class="total">Estimated Total: ${formatCurrency(data.estimatedTotal)}</p>` : ''}
        </div>

        ${data.notes ? `
        <div class="section">
          <h2>Notes</h2>
          <p class="value">${data.notes}</p>
        </div>
        ` : ''}

        <div class="footer">
          Generated by All Business Needs Procurement Platform
        </div>
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-overlay flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-surface rounded-xl shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3 shrink-0">
          <div>
            <h3 className="text-sm font-semibold text-text">RFQ Preview</h3>
            <p className="text-xs text-text-muted">{data.reference}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-hover transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </button>
            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-text-muted hover:bg-surface-hover hover:text-text transition-colors"
              aria-label="Close preview"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="border-b-2 border-primary pb-4">
              <h1 className="text-lg font-semibold text-primary">All Business Needs</h1>
              <p className="text-xs text-text-muted mt-0.5">Request for Quotation</p>
            </div>

            {/* Reference & Urgency */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-muted">Reference</p>
                <p className="text-sm font-medium text-text">{data.reference}</p>
                <p className="text-xs text-text-muted">{data.date}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Urgency</p>
                <p className="text-sm font-medium capitalize text-text">{data.urgency}</p>
                {data.budgetRange && (
                  <p className="text-xs text-text-muted">Budget: {data.budgetRange}</p>
                )}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-sm font-semibold text-text border-b border-border pb-1 mb-2">
                Contact Information
              </h2>
              <p className="text-sm text-text">{data.contact.full_name}</p>
              <p className="text-xs text-text-muted">
                {data.contact.job_title && `${data.contact.job_title} at `}{data.contact.company}
              </p>
              <p className="text-xs text-text-muted">
                {data.contact.email} | {data.contact.phone}
              </p>
            </div>

            {/* Delivery */}
            {data.delivery && (
              <div>
                <h2 className="text-sm font-semibold text-text border-b border-border pb-1 mb-2">
                  Delivery Address
                </h2>
                <p className="text-sm text-text">{data.delivery.address_line1}</p>
                {data.delivery.address_line2 && (
                  <p className="text-sm text-text">{data.delivery.address_line2}</p>
                )}
                <p className="text-sm text-text">
                  {data.delivery.city}{data.delivery.state ? `, ${data.delivery.state}` : ''} {data.delivery.postal_code}
                </p>
              </div>
            )}

            {/* Items Table */}
            <div>
              <h2 className="text-sm font-semibold text-text border-b border-border pb-1 mb-2">
                Procurement Items ({data.items.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-text-muted border-b border-border">
                      <th className="text-left py-2 px-2">#</th>
                      <th className="text-left py-2 px-2">Product</th>
                      <th className="text-left py-2 px-2">SKU</th>
                      <th className="text-center py-2 px-2">Qty</th>
                      <th className="text-right py-2 px-2">Unit</th>
                      <th className="text-right py-2 px-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((item, i) => (
                      <tr key={item.id} className="border-b border-border/50">
                        <td className="py-2 px-2 text-text-muted">{i + 1}</td>
                        <td className="py-2 px-2 font-medium text-text max-w-[200px] truncate">
                          {item.product_name}
                        </td>
                        <td className="py-2 px-2 text-text-muted font-mono text-xs">
                          {item.sku || '-'}
                        </td>
                        <td className="py-2 px-2 text-center">{item.quantity}</td>
                        <td className="py-2 px-2 text-right">
                          {item.unit_price || item.target_price
                            ? formatCurrency(item.unit_price || item.target_price || 0)
                            : 'TBD'}
                        </td>
                        <td className="py-2 px-2 text-right font-medium">
                          {item.unit_price || item.target_price
                            ? formatCurrency((item.unit_price || item.target_price || 0) * item.quantity)
                            : 'TBD'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {data.estimatedTotal > 0 && (
                <div className="mt-3 flex justify-end">
                  <div className="text-right">
                    <p className="text-xs text-text-muted">Estimated Total</p>
                    <p className="text-lg font-semibold text-text">
                      {formatCurrency(data.estimatedTotal)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            {data.notes && (
              <div>
                <h2 className="text-sm font-semibold text-text border-b border-border pb-1 mb-2">
                  Notes
                </h2>
                <p className="text-sm text-text-secondary whitespace-pre-wrap">{data.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="pt-4 border-t border-border text-center">
              <p className="text-[10px] text-text-muted">
                Generated by All Business Needs Procurement Platform
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { PdfPreviewModal }
export type { PdfPreviewData }
