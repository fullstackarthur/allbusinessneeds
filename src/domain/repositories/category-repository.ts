import type { Category } from '@/domain/entities'

export interface CategoryRepository {
  getAll(): Promise<Category[]>
  getById(id: string): Promise<Category>
  getBySlug(slug: string): Promise<Category>
  getTree(): Promise<Category[]>
}
