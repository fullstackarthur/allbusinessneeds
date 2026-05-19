import type { AiSuggestion, Product } from '@/domain/entities'
import type { AiRequest, AiResponse } from '@/core/types/ai-schemas'

export interface AiRepository {
  getSuggestions(context: string, limit?: number): Promise<AiSuggestion[]>
  findAlternatives(productId: string, limit?: number): Promise<Product[]>
  analyzeRfq(rfqId: string): Promise<{ suggestions: AiSuggestion[]; estimatedTotal: number }>
  generateDescription(productData: Record<string, unknown>): Promise<string>
  chat(request: AiRequest): Promise<AiResponse>
  analyzeProductContext(productId: string, context: string): Promise<AiResponse>
  suggestComplementaryProducts(rfqItems: Array<{ product_id: string; quantity: number }>): Promise<AiResponse>
}
