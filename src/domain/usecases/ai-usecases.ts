import type { AiRequest, AiResponse } from '@/core/types/ai-schemas'
import type { AiRepository } from '@/domain/repositories/ai-repository'

export class AiChat {
  repository: AiRepository

  constructor(repository: AiRepository) {
    this.repository = repository
  }

  async execute(request: AiRequest): Promise<AiResponse> {
    return this.repository.chat(request)
  }
}

export class AiAnalyzeProduct {
  repository: AiRepository

  constructor(repository: AiRepository) {
    this.repository = repository
  }

  async execute(productId: string, context: string): Promise<AiResponse> {
    return this.repository.analyzeProductContext(productId, context)
  }
}

export class AiSuggestComplementary {
  repository: AiRepository

  constructor(repository: AiRepository) {
    this.repository = repository
  }

  async execute(rfqItems: Array<{ product_id: string; quantity: number }>): Promise<AiResponse> {
    return this.repository.suggestComplementaryProducts(rfqItems)
  }
}
