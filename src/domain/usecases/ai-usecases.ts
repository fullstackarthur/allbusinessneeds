import type { AiSuggestion, Product } from '@/domain/entities'
import type { AiRepository } from '@/domain/repositories/ai-repository'

export class GetAiSuggestions {
  repository: AiRepository

  constructor(repository: AiRepository) {
    this.repository = repository
  }

  async execute(context: string, limit = 5): Promise<AiSuggestion[]> {
    return this.repository.getSuggestions(context, limit)
  }
}

export class FindAlternatives {
  repository: AiRepository

  constructor(repository: AiRepository) {
    this.repository = repository
  }

  async execute(productId: string, limit = 4): Promise<Product[]> {
    return this.repository.findAlternatives(productId, limit)
  }
}

export class AnalyzeRfq {
  repository: AiRepository

  constructor(repository: AiRepository) {
    this.repository = repository
  }

  async execute(rfqId: string): Promise<{ suggestions: AiSuggestion[]; estimatedTotal: number }> {
    return this.repository.analyzeRfq(rfqId)
  }
}
