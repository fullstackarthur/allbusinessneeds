import type { Product } from '@/domain/entities'
import type { ProductRepository, ProductFilters } from '@/domain/repositories/product-repository'

export class GetProducts {
  repository: ProductRepository

  constructor(repository: ProductRepository) {
    this.repository = repository
  }

  async execute(filters?: ProductFilters) {
    return this.repository.getAll(filters)
  }
}

export class GetProductById {
  repository: ProductRepository

  constructor(repository: ProductRepository) {
    this.repository = repository
  }

  async execute(id: string): Promise<Product> {
    return this.repository.getById(id)
  }
}

export class GetRelatedProducts {
  repository: ProductRepository

  constructor(repository: ProductRepository) {
    this.repository = repository
  }

  async execute(id: string, limit = 4): Promise<Product[]> {
    return this.repository.getRelated(id, limit)
  }
}

export class SearchProducts {
  repository: ProductRepository

  constructor(repository: ProductRepository) {
    this.repository = repository
  }

  async execute(query: string, limit = 10): Promise<Product[]> {
    return this.repository.search(query, limit)
  }
}

export class GetRandomProducts {
  repository: ProductRepository

  constructor(repository: ProductRepository) {
    this.repository = repository
  }

  async execute(limit = 8): Promise<Product[]> {
    return this.repository.getRandom(limit)
  }
}
