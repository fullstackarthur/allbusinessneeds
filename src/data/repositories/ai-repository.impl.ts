import type { AiSuggestion, Product } from '@/domain/entities'
import type { AiRepository } from '@/domain/repositories/ai-repository'
import { httpClient } from '@/core/http/client'
import { AiSuggestionMapper, ProductMapper } from '@/data/mappers'
import type { AiSuggestionDto, ProductDto } from '@/data/dtos'

const AI_ENDPOINT = '/ai'

export class AiRepositoryImpl implements AiRepository {
  async getSuggestions(context: string, limit = 5): Promise<AiSuggestion[]> {
    const response = await httpClient.post<AiSuggestionDto[]>(`${AI_ENDPOINT}/suggestions`, {
      context,
      limit,
    })
    return response.data.map(AiSuggestionMapper.toEntity)
  }

  async findAlternatives(productId: string, limit = 4): Promise<Product[]> {
    const response = await httpClient.get<ProductDto[]>(
      `${AI_ENDPOINT}/alternatives/${productId}`,
      { headers: { 'X-Limit': String(limit) } },
    )
    return response.data.map(ProductMapper.toEntity)
  }

  async analyzeRfq(rfqId: string): Promise<{ suggestions: AiSuggestion[]; estimatedTotal: number }> {
    const response = await httpClient.post<{ suggestions: AiSuggestionDto[]; estimated_total: number }>(
      `${AI_ENDPOINT}/analyze-rfq`,
      { rfq_id: rfqId },
    )
    return {
      suggestions: response.data.suggestions.map(AiSuggestionMapper.toEntity),
      estimatedTotal: response.data.estimated_total,
    }
  }

  async generateDescription(productData: Record<string, unknown>): Promise<string> {
    const response = await httpClient.post<{ description: string }>(
      `${AI_ENDPOINT}/generate-description`,
      { product_data: productData },
    )
    return response.data.description
  }
}
