import type { Category } from '@/domain/entities'
import type { CategoryRepository } from '@/domain/repositories/category-repository'

export class GetCategories {
  repository: CategoryRepository

  constructor(repository: CategoryRepository) {
    this.repository = repository
  }

  async execute(): Promise<Category[]> {
    return this.repository.getAll()
  }
}

export class GetCategoryTree {
  repository: CategoryRepository

  constructor(repository: CategoryRepository) {
    this.repository = repository
  }

  async execute(): Promise<Category[]> {
    return this.repository.getTree()
  }
}

export class GetCategoryBySlug {
  repository: CategoryRepository

  constructor(repository: CategoryRepository) {
    this.repository = repository
  }

  async execute(slug: string): Promise<Category> {
    return this.repository.getBySlug(slug)
  }
}
