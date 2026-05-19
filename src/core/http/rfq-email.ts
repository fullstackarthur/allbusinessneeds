import type { RfqItem, RfqContact, RfqDelivery } from '@/core/types/rfq-schemas'
import { generateEmailPayload } from '@/core/utils/rfq-pdf'
import { httpClient } from '@/core/http/client'

export interface RfqEmailPayload {
  reference: string
  items: RfqItem[]
  contact: RfqContact
  delivery?: RfqDelivery | null
  notes?: string
  urgency: string
  budgetRange?: string
  estimatedTotal: number
  categories: string[]
}

export interface RfqEmailService {
  submitToSales(payload: RfqEmailPayload): Promise<{ success: boolean; messageId?: string }>
  sendConfirmation(payload: RfqEmailPayload): Promise<{ success: boolean }>
}

export class RfqEmailServiceImpl implements RfqEmailService {
  async submitToSales(payload: RfqEmailPayload): Promise<{ success: boolean; messageId?: string }> {
    const { subject, body } = generateEmailPayload({
      reference: payload.reference,
      date: new Date().toISOString(),
      status: 'submitted',
      items: payload.items,
      contact: payload.contact,
      delivery: payload.delivery,
      notes: payload.notes,
      urgency: payload.urgency,
      budgetRange: payload.budgetRange,
      estimatedTotal: payload.estimatedTotal,
      categories: payload.categories,
    })

    try {
      await httpClient.post('/rfq/submit', {
        reference: payload.reference,
        to: 'sales@allbusinessneeds.com',
        from: payload.contact.email,
        subject,
        body,
        items: payload.items,
        contact: payload.contact,
        delivery: payload.delivery,
        notes: payload.notes,
        urgency: payload.urgency,
        budget_range: payload.budgetRange,
        estimated_total: payload.estimatedTotal,
        categories: payload.categories,
      })

      return { success: true }
    } catch {
      return { success: false }
    }
  }

  async sendConfirmation(payload: RfqEmailPayload): Promise<{ success: boolean }> {
    try {
      await httpClient.post('/rfq/confirmation', {
        to: payload.contact.email,
        reference: payload.reference,
        items: payload.items,
        estimated_total: payload.estimatedTotal,
      })

      return { success: true }
    } catch {
      return { success: false }
    }
  }
}

export const rfqEmailService = new RfqEmailServiceImpl()
