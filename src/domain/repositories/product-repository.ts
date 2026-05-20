import type { Product } from '@/domain/entities'

export interface ProductFilters {
  category?: string
  subcategory?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  inStock?: boolean
  search?: string
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'name' | 'newest'
  page?: number
  limit?: number
}

export interface ProductRepository {
  getAll(filters?: ProductFilters): Promise<{ products: Product[]; total: number; page: number; totalPages: number }>
  getById(id: string): Promise<Product>
  getRelated(id: string, limit?: number): Promise<Product[]>
  search(query: string, limit?: number): Promise<Product[]>
  getRandom(limit?: number): Promise<Product[]>
}
