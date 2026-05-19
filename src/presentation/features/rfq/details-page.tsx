import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { AttachmentUploader } from '@/shared/components/ui/attachment-uploader'
import { PdfPreviewModal } from '@/shared/components/ui/pdf-preview'
import { useRfqWorkflowStore } from '@/presentation/stores/rfq-workflow-store'
import type { RfqContact, RfqDelivery } from '@/core/types/rfq-schemas'
import { ROUTES } from '@/core/constants'
import {
  ChevronRight,
  ArrowLeft,
  User,
  MapPin,
  AlertCircle,
  Paperclip,
  Eye,
} from 'lucide-react'
import * as React from 'react'

function RfqDetailsPage() {
  const contact = useRfqWorkflowStore((state) => state.contact)
  const delivery = useRfqWorkflowStore((state) => state.delivery)
  const attachments = useRfqWorkflowStore((state) => state.attachments)
  const setContact = useRfqWorkflowStore((state) => state.setContact)
  const setDelivery = useRfqWorkflowStore((state) => state.setDelivery)
  const setAttachments = useRfqWorkflowStore((state) => state.setAttachments)
  const setStep = useRfqWorkflowStore((state) => state.setStep)
  const items = useRfqWorkflowStore((state) => state.items)
  const notes = useRfqWorkflowStore((state) => state.notes)
  const urgency = useRfqWorkflowStore((state) => state.urgency)
  const budgetRange = useRfqWorkflowStore((state) => state.budgetRange)
  const getEstimatedTotal = useRfqWorkflowStore((state) => state.getEstimatedTotal)
  const getCategories = useRfqWorkflowStore((state) => state.getCategories)
  const error = useRfqWorkflowStore((state) => state.error)
  const clearError = useRfqWorkflowStore((state) => state.clearError)

  const [formData, setFormData] = React.useState<RfqContact>({
    full_name: contact?.full_name || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    company: contact?.company || '',
    job_title: contact?.job_title || '',
    department: contact?.department || '',
  })

  const [deliveryData, setDeliveryData] = React.useState<RfqDelivery>({
    address_line1: delivery?.address_line1 || '',
    address_line2: delivery?.address_line2 || '',
    city: delivery?.city || '',
    state: delivery?.state || '',
    postal_code: delivery?.postal_code || '',
    country: delivery?.country || 'US',
    delivery_instructions: delivery?.delivery_instructions || '',
    preferred_date: delivery?.preferred_date || '',
  })

  const [showDelivery, setShowDelivery] = React.useState(delivery !== null)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [showPdfPreview, setShowPdfPreview] = React.useState(false)

  const validateContact = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.full_name.trim()) newErrors.full_name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid email is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.company.trim()) newErrors.company = 'Company name is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    clearError()
    if (!validateContact()) return

    setContact(formData)
    if (showDelivery) setDelivery(deliveryData)
    setStep('confirmation')
  }

  const pdfData = {
    reference: 'PREVIEW',
    date: new Date().toLocaleDateString(),
    items,
    contact: formData,
    delivery: showDelivery ? deliveryData : null,
    notes,
    urgency,
    budgetRange: budgetRange || undefined,
    estimatedTotal: getEstimatedTotal(),
    categories: getCategories(),
  }

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Link to={ROUTES.HOME} className="hover:text-text transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text">RFQ Details</span>
        </div>

        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-active">
            <AlertCircle className="h-6 w-6 text-text-muted" />
          </div>
          <h2 className="text-lg font-semibold text-text">No items to submit</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Add products to your RFQ before submitting
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
        <Link to="/rfq/review" className="hover:text-text transition-colors">Review RFQ</Link>
        <span>/</span>
        <span className="text-text">Details</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text">Contact Information</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Provide your details so we can prepare your quotation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowPdfPreview(true)}>
            <Eye className="mr-1.5 h-4 w-4" />
            Preview
          </Button>
          <Button variant="outline" size="sm" onClick={() => setStep('review')}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive-muted px-4 py-3">
          <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Contact Form */}
      <div className="rounded-lg border border-border bg-surface p-4 space-y-4">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-text">Contact Details</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="full_name" className="text-sm font-medium text-text">
              Full Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="John Smith"
              error={errors.full_name}
              className="mt-1.5"
            />
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium text-text">
              Email <span className="text-destructive">*</span>
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@company.com"
              error={errors.email}
              className="mt-1.5"
            />
          </div>

          <div>
            <label htmlFor="phone" className="text-sm font-medium text-text">
              Phone <span className="text-destructive">*</span>
            </label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              error={errors.phone}
              className="mt-1.5"
            />
          </div>

          <div>
            <label htmlFor="company" className="text-sm font-medium text-text">
              Company <span className="text-destructive">*</span>
            </label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Acme Corporation"
              error={errors.company}
              className="mt-1.5"
            />
          </div>

          <div>
            <label htmlFor="job_title" className="text-sm font-medium text-text">
              Job Title <span className="text-text-muted font-normal">(optional)</span>
            </label>
            <Input
              id="job_title"
              value={formData.job_title}
              onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
              placeholder="Procurement Manager"
              className="mt-1.5"
            />
          </div>

          <div>
            <label htmlFor="department" className="text-sm font-medium text-text">
              Department <span className="text-text-muted font-normal">(optional)</span>
            </label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="Operations"
              className="mt-1.5"
            />
          </div>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="rounded-lg border border-border bg-surface">
        <button
          onClick={() => setShowDelivery(!showDelivery)}
          className="flex w-full items-center justify-between p-4 text-left"
        >
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-text">Delivery Information</h3>
            <span className="text-xs text-text-muted">(optional)</span>
          </div>
          <svg
            className={`h-4 w-4 text-text-muted transition-transform ${showDelivery ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDelivery && (
          <div className="border-t border-border p-4 space-y-4">
            <div>
              <label htmlFor="address1" className="text-sm font-medium text-text">
                Address Line 1 <span className="text-destructive">*</span>
              </label>
              <Input
                id="address1"
                value={deliveryData.address_line1}
                onChange={(e) => setDeliveryData({ ...deliveryData, address_line1: e.target.value })}
                placeholder="123 Business Park"
                className="mt-1.5"
              />
            </div>

            <div>
              <label htmlFor="address2" className="text-sm font-medium text-text">
                Address Line 2 <span className="text-text-muted font-normal">(optional)</span>
              </label>
              <Input
                id="address2"
                value={deliveryData.address_line2}
                onChange={(e) => setDeliveryData({ ...deliveryData, address_line2: e.target.value })}
                placeholder="Suite 100"
                className="mt-1.5"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="city" className="text-sm font-medium text-text">City</label>
                <Input
                  id="city"
                  value={deliveryData.city}
                  onChange={(e) => setDeliveryData({ ...deliveryData, city: e.target.value })}
                  placeholder="New York"
                  className="mt-1.5"
                />
              </div>

              <div>
                <label htmlFor="state" className="text-sm font-medium text-text">State</label>
                <Input
                  id="state"
                  value={deliveryData.state}
                  onChange={(e) => setDeliveryData({ ...deliveryData, state: e.target.value })}
                  placeholder="NY"
                  className="mt-1.5"
                />
              </div>

              <div>
                <label htmlFor="postal" className="text-sm font-medium text-text">Postal Code</label>
                <Input
                  id="postal"
                  value={deliveryData.postal_code}
                  onChange={(e) => setDeliveryData({ ...deliveryData, postal_code: e.target.value })}
                  placeholder="10001"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="delivery_instructions" className="text-sm font-medium text-text">
                Delivery Instructions <span className="text-text-muted font-normal">(optional)</span>
              </label>
              <textarea
                id="delivery_instructions"
                value={deliveryData.delivery_instructions}
                onChange={(e) => setDeliveryData({ ...deliveryData, delivery_instructions: e.target.value })}
                placeholder="Loading dock access required, deliver between 9am-5pm..."
                rows={2}
                className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary resize-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Attachments */}
      <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Paperclip className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-text">Procurement Files</h3>
          <span className="text-xs text-text-muted">(optional)</span>
        </div>
        <p className="text-xs text-text-secondary">
          Upload specifications, drawings, or any relevant documents
        </p>
        <AttachmentUploader
          files={attachments}
          onFilesChange={setAttachments}
          maxFiles={5}
          maxSizeMB={10}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setStep('review')} className="flex-1">
          Back to Review
        </Button>
        <Button onClick={handleContinue} className="flex-1">
          Review & Submit
          <ChevronRight className="ml-1.5 h-4 w-4" />
        </Button>
      </div>

      {/* PDF Preview Modal */}
      <PdfPreviewModal
        data={pdfData}
        open={showPdfPreview}
        onClose={() => setShowPdfPreview(false)}
      />
    </div>
  )
}

export { RfqDetailsPage }
