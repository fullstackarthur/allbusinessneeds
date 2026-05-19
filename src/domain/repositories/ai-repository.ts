import type { AiSuggestion, Product } from '@/domain/entities'

export interface AiRepository {
  getSuggestions(context: string, limit?: number): Promise<AiSuggestion[]>
  findAlternatives(productId: string, limit?: number): Promise<Product[]>
  analyzeRfq(rfqId: string): Promise<{ suggestions: AiSuggestion[]; estimatedTotal: number }>
  generateDescription(productData: Record<string, unknown>): Promise<string>
}
