import type { Product } from '@/domain/entities'
import type { ProductRepository, ProductFilters } from '@/domain/repositories/product-repository'
import { httpClient } from '@/core/http/client'
import { ProductMapper } from '@/data/mappers'
import type { ProductListDto, ProductDto } from '@/data/dtos'

const PRODUCTS_ENDPOINT = '/products'

export class ProductRepositoryImpl implements ProductRepository {
  async getAll(filters?: ProductFilters) {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value))
        }
      })
    }

    const response = await httpClient.get<ProductListDto>(
      `${PRODUCTS_ENDPOINT}?${params.toString()}`,
    )

    return {
      products: response.data.data.map(ProductMapper.toEntity),
      total: response.data.meta.total,
      page: response.data.meta.page,
      totalPages: response.data.meta.total_pages,
    }
  }

  async getById(id: string): Promise<Product> {
    const response = await httpClient.get<ProductDto>(`${PRODUCTS_ENDPOINT}/${id}`)
    return ProductMapper.toEntity(response.data)
  }

  async getRelated(id: string, limit = 4): Promise<Product[]> {
    const response = await httpClient.get<ProductDto[]>(
      `${PRODUCTS_ENDPOINT}/${id}/related`,
      { headers: { 'X-Limit': String(limit) } },
    )
    return response.data.map(ProductMapper.toEntity)
  }

  async search(query: string, limit = 10): Promise<Product[]> {
    const response = await httpClient.get<ProductDto[]>(
      `${PRODUCTS_ENDPOINT}/search`,
      { headers: { 'X-Query': query, 'X-Limit': String(limit) } },
    )
    return response.data.map(ProductMapper.toEntity)
  }

  async getRandom(limit = 8): Promise<Product[]> {
    const response = await httpClient.get<ProductDto[]>(
      `${PRODUCTS_ENDPOINT}/random`,
      { headers: { 'X-Limit': String(limit) } },
    )
    return response.data.map(ProductMapper.toEntity)
  }
}
