import type { Category } from '@/domain/entities'
import type { CategoryRepository } from '@/domain/repositories/category-repository'
import { httpClient } from '@/core/http/client'
import { CategoryMapper } from '@/data/mappers'
import type { CategoryDto } from '@/data/dtos'

const CATEGORIES_ENDPOINT = '/categories'

export class CategoryRepositoryImpl implements CategoryRepository {
  async getAll(): Promise<Category[]> {
    const response = await httpClient.get<CategoryDto[]>(CATEGORIES_ENDPOINT)
    return response.data.map(CategoryMapper.toEntity)
  }

  async getById(id: string): Promise<Category> {
    const response = await httpClient.get<CategoryDto>(`${CATEGORIES_ENDPOINT}/${id}`)
    return CategoryMapper.toEntity(response.data)
  }

  async getBySlug(slug: string): Promise<Category> {
    const response = await httpClient.get<CategoryDto>(`${CATEGORIES_ENDPOINT}/slug/${slug}`)
    return CategoryMapper.toEntity(response.data)
  }

  async getTree(): Promise<Category[]> {
    const response = await httpClient.get<CategoryDto[]>(`${CATEGORIES_ENDPOINT}/tree`)
    return response.data.map(CategoryMapper.toEntity)
  }
}
