import { z } from 'zod'

export const RfqStatusSchema = z.enum([
  'draft',
  'submitted',
  'awaiting_quotation',
  'quoted',
  'negotiating',
  'accepted',
  'rejected',
  'expired',
  'completed',
])

export const RfqItemSchema = z.object({
  id: z.string(),
  product_id: z.string(),
  product_name: z.string(),
  sku: z.string().optional(),
  brand: z.string().optional(),
  thumbnail: z.string().optional(),
  quantity: z.number().min(1),
  unit_price: z.number().optional(),
  target_price: z.number().optional(),
  specifications: z.string().optional(),
  notes: z.string().optional(),
  category: z.string().optional(),
})

export const RfqContactSchema = z.object({
  full_name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(6, 'Valid phone number is required'),
  company: z.string().min(2, 'Company name is required'),
  job_title: z.string().optional(),
  department: z.string().optional(),
})

export const RfqDeliverySchema = z.object({
  address_line1: z.string().min(2, 'Address is required'),
  address_line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  postal_code: z.string().min(1, 'Postal code is required'),
  country: z.string().default('US'),
  delivery_instructions: z.string().optional(),
  preferred_date: z.string().optional(),
})

export const RfqSubmissionSchema = z.object({
  items: z.array(RfqItemSchema).min(1, 'At least one item is required'),
  contact: RfqContactSchema,
  delivery: RfqDeliverySchema.optional(),
  notes: z.string().optional(),
  urgency: z.enum(['standard', 'urgent', 'critical']).default('standard'),
  budget_range: z.string().optional(),
  attachments: z.array(z.string()).optional(),
})

export const RfqSummarySchema = z.object({
  reference: z.string(),
  status: RfqStatusSchema,
  item_count: z.number(),
  categories: z.array(z.string()),
  estimated_total: z.number().optional(),
  submitted_at: z.string().optional(),
  responded_at: z.string().optional(),
  completed_at: z.string().optional(),
})

export const QuotationItemSchema = z.object({
  product_id: z.string(),
  product_name: z.string(),
  quantity: z.number(),
  unit_price: z.number(),
  total_price: z.number(),
  notes: z.string().optional(),
})

export const QuotationSchema = z.object({
  id: z.string(),
  rfq_reference: z.string(),
  supplier_name: z.string(),
  items: z.array(QuotationItemSchema),
  subtotal: z.number(),
  tax: z.number(),
  total: z.number(),
  valid_until: z.string(),
  terms: z.array(z.string()).optional(),
  notes: z.string().optional(),
  created_at: z.string(),
})

export type RfqStatus = z.infer<typeof RfqStatusSchema>
export type RfqItem = z.infer<typeof RfqItemSchema>
export type RfqContact = z.infer<typeof RfqContactSchema>
export type RfqDelivery = z.infer<typeof RfqDeliverySchema>
export type RfqSubmission = z.infer<typeof RfqSubmissionSchema>
export type RfqSummary = z.infer<typeof RfqSummarySchema>
export type QuotationItem = z.infer<typeof QuotationItemSchema>
export type Quotation = z.infer<typeof QuotationSchema>

export const RFQ_STATUS_LABELS: Record<RfqStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  awaiting_quotation: 'Awaiting Quotation',
  quoted: 'Quoted',
  negotiating: 'Negotiating',
  accepted: 'Accepted',
  rejected: 'Rejected',
  expired: 'Expired',
  completed: 'Completed',
}

export const RFQ_STATUS_COLORS: Record<RfqStatus, string> = {
  draft: 'secondary',
  submitted: 'default',
  awaiting_quotation: 'warning',
  quoted: 'success',
  negotiating: 'default',
  accepted: 'success',
  rejected: 'destructive',
  expired: 'destructive',
  completed: 'success',
}
