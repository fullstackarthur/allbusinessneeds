import { N8N_WEBHOOK_URL } from '@/core/constants'
import type { N8nRfqPayload } from '@/data/dtos/supabase'

export class N8nWebhookError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'N8nWebhookError'
    this.status = status
  }
}

export async function submitRfqToN8n(payload: N8nRfqPayload): Promise<{ success: boolean; rfq_ref: string }> {
  if (!N8N_WEBHOOK_URL) {
    throw new N8nWebhookError('N8N_WEBHOOK_URL is not configured')
  }

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new N8nWebhookError(`Webhook returned ${response.status}`, response.status)
    }

    await response.json()
    return { success: true, rfq_ref: payload.rfq_ref }
  } catch (error) {
    if (error instanceof N8nWebhookError) throw error
    throw new N8nWebhookError(error instanceof Error ? error.message : 'Failed to submit RFQ')
  }
}
