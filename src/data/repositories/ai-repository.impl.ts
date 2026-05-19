import type { AiSuggestion, Product } from '@/domain/entities'
import type { AiRepository } from '@/domain/repositories/ai-repository'
import { httpClient } from '@/core/http/client'
import { AiSuggestionMapper, ProductMapper } from '@/data/mappers'
import type { AiSuggestionDto, ProductDto } from '@/data/dtos'
import type { AiRequest, AiResponse } from '@/core/types/ai-schemas'
import { AiResponseSchema } from '@/core/types/ai-schemas'
import { AppError } from '@/core/errors'

const AI_ENDPOINT = '/ai'
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || ''

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

  async chat(request: AiRequest): Promise<AiResponse> {
    const url = N8N_WEBHOOK_URL || `${AI_ENDPOINT}/chat`

    const response = await httpClient.post<unknown>(url, request)

    try {
      const parsed = AiResponseSchema.parse(response.data)
      return parsed
    } catch {
      throw new AppError('AI response format is invalid', 500)
    }
  }

  async analyzeProductContext(productId: string, context: string): Promise<AiResponse> {
    const response = await httpClient.post<unknown>(`${AI_ENDPOINT}/analyze-product`, {
      product_id: productId,
      context,
    })

    try {
      const parsed = AiResponseSchema.parse(response.data)
      return parsed
    } catch {
      throw new AppError('AI response format is invalid', 500)
    }
  }

  async suggestComplementaryProducts(rfqItems: Array<{ product_id: string; quantity: number }>): Promise<AiResponse> {
    const response = await httpClient.post<unknown>(`${AI_ENDPOINT}/suggest-complementary`, {
      rfq_items: rfqItems,
    })

    try {
      const parsed = AiResponseSchema.parse(response.data)
      return parsed
    } catch {
      throw new AppError('AI response format is invalid', 500)
    }
  }
}
