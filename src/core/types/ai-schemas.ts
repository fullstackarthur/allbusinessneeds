import { z } from 'zod'

export const AiProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string(),
  brand: z.string().optional(),
  price: z.number(),
  currency: z.string(),
  stock: z.number(),
  thumbnail: z.string(),
  rating: z.number().optional(),
  relevance_score: z.number().min(0).max(1).optional(),
  reason: z.string().optional(),
})

export const AiQuantityRecommendationSchema = z.object({
  product_id: z.string(),
  product_name: z.string(),
  recommended_quantity: z.number().min(1),
  reasoning: z.string().optional(),
  unit: z.string().optional(),
})

export const AiProcurementBundleSchema = z.object({
  title: z.string(),
  description: z.string(),
  products: z.array(AiProductSchema),
  estimated_total: z.number(),
  savings_note: z.string().optional(),
})

export const AiInventoryAlertSchema = z.object({
  product_id: z.string(),
  product_name: z.string(),
  current_stock: z.number(),
  alert_type: z.enum(['low_stock', 'out_of_stock', 'price_change', 'discontinued']),
  message: z.string(),
  action_suggested: z.string().optional(),
})

export const AiClarificationRequestSchema = z.object({
  question: z.string(),
  context: z.string().optional(),
  options: z.array(z.string()).optional(),
  field: z.string().optional(),
})

export const AiRfqSummarySchema = z.object({
  item_count: z.number(),
  estimated_total: z.number(),
  categories: z.array(z.string()),
  notes: z.string().optional(),
  suggestions: z.array(z.string()).optional(),
})

export const AiSpecificationSummarySchema = z.object({
  product_id: z.string(),
  product_name: z.string(),
  key_specs: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })),
  compliance_notes: z.array(z.string()).optional(),
})

export const AiResponseBlockSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('text'),
    content: z.string(),
  }),
  z.object({
    type: z.literal('product_recommendations'),
    title: z.string().optional(),
    products: z.array(AiProductSchema),
    context: z.string().optional(),
  }),
  z.object({
    type: z.literal('quantity_recommendations'),
    recommendations: z.array(AiQuantityRecommendationSchema),
    context: z.string().optional(),
  }),
  z.object({
    type: z.literal('procurement_bundle'),
    bundle: AiProcurementBundleSchema,
  }),
  z.object({
    type: z.literal('inventory_alert'),
    alert: AiInventoryAlertSchema,
  }),
  z.object({
    type: z.literal('clarification'),
    request: AiClarificationRequestSchema,
  }),
  z.object({
    type: z.literal('rfq_summary'),
    summary: AiRfqSummarySchema,
  }),
  z.object({
    type: z.literal('specification_summary'),
    spec: AiSpecificationSummarySchema,
  }),
])

export const AiResponseSchema = z.object({
  session_id: z.string(),
  blocks: z.array(AiResponseBlockSchema),
  confidence: z.number().min(0).max(1).optional(),
  requires_followup: z.boolean().optional(),
})

export const AiRequestSchema = z.object({
  message: z.string(),
  session_id: z.string().optional(),
  context: z.object({
    current_rfq_items: z.array(z.object({
      product_id: z.string(),
      product_name: z.string(),
      quantity: z.number(),
    })).optional(),
    active_category: z.string().optional(),
    viewed_products: z.array(z.string()).optional(),
    procurement_type: z.string().optional(),
  }).optional(),
})

export type AiProduct = z.infer<typeof AiProductSchema>
export type AiQuantityRecommendation = z.infer<typeof AiQuantityRecommendationSchema>
export type AiProcurementBundle = z.infer<typeof AiProcurementBundleSchema>
export type AiInventoryAlert = z.infer<typeof AiInventoryAlertSchema>
export type AiClarificationRequest = z.infer<typeof AiClarificationRequestSchema>
export type AiRfqSummary = z.infer<typeof AiRfqSummarySchema>
export type AiSpecificationSummary = z.infer<typeof AiSpecificationSummarySchema>
export type AiResponseBlock = z.infer<typeof AiResponseBlockSchema>
export type AiResponse = z.infer<typeof AiResponseSchema>
export type AiRequest = z.infer<typeof AiRequestSchema>
