import type { Product } from '@/domain/entities'
import type { ProductRepository, ProductFilters } from '@/domain/repositories/product-repository'
import { supabase } from '@/data/supabase/client'
import { SupabaseMapper } from '@/data/mappers/supabase-mapper'
import type { ProductListingDto, ProductDetailDto } from '@/data/dtos/supabase'

export class SupabaseProductRepository implements ProductRepository {
  async getAll(filters?: ProductFilters) {
    let query = supabase.from('product_listing').select('*', { count: 'exact' })

    if (filters?.category) {
      query = query.eq('category_slug', filters.category)
    }

    if (filters?.brand) {
      query = query.ilike('brand_name', `%${filters.brand}%`)
    }

    if (filters?.inStock) {
      query = query.eq('in_stock', true)
    }

    if (filters?.minPrice !== undefined) {
      query = query.or(`our_price.gte.${filters.minPrice},offer_price.gte.${filters.minPrice}`)
    }

    if (filters?.maxPrice !== undefined) {
      query = query.or(`our_price.lte.${filters.maxPrice},offer_price.lte.${filters.maxPrice}`)
    }

    if (filters?.search) {
      query = query.ilike('title', `%${filters.search}%`)
    }

    switch (filters?.sortBy) {
      case 'price_asc':
        query = query.order('offer_price', { ascending: true })
        break
      case 'price_desc':
        query = query.order('offer_price', { ascending: false })
        break
      case 'name':
        query = query.order('title', { ascending: true })
        break
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }

    const page = filters?.page || 1
    const limit = filters?.limit || 20
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, count, error } = await query.range(from, to)

    if (error) {
      console.error('[SupabaseProductRepository.getAll] Query error:', error)
      throw new Error(`Supabase query failed: ${error.message}`)
    }

    return {
      products: (data as ProductListingDto[] || []).map(SupabaseMapper.toProductEntity),
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    }
  }

  async getById(id: string): Promise<Product> {
    const { data, error } = await supabase
      .from('product_detail')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('[SupabaseProductRepository.getById] Query error:', error)
      throw new Error(`Product not found: ${error.message}`)
    }

    return SupabaseMapper.toProductEntity(data as ProductDetailDto)
  }

  async getRelated(id: string, limit = 4): Promise<Product[]> {
    const { data: current } = await supabase
      .from('product_detail')
      .select('category_slug')
      .eq('id', id)
      .single()

    if (!current?.category_slug) return []

    const { data, error } = await supabase
      .from('product_listing')
      .select('*')
      .eq('category_slug', current.category_slug)
      .neq('id', id)
      .limit(limit)

    if (error) {
      console.error('[SupabaseProductRepository.getRelated] Query error:', error)
      throw new Error(`Related products query failed: ${error.message}`)
    }

    return (data as ProductListingDto[] || []).map(SupabaseMapper.toProductEntity)
  }

  async search(query: string, limit = 10): Promise<Product[]> {
    const { data, error } = await supabase
      .from('product_listing')
      .select('*')
      .ilike('title', `%${query}%`)
      .limit(limit)

    if (error) {
      console.error('[SupabaseProductRepository.search] Query error:', error)
      throw new Error(`Search query failed: ${error.message}`)
    }

    return (data as ProductListingDto[] || []).map(SupabaseMapper.toProductEntity)
  }

  async getRandom(limit = 8): Promise<Product[]> {
    const { data, error } = await supabase
      .from('product_listing')
      .select('*', { count: 'exact' })

    if (error) {
      console.error('[SupabaseProductRepository.getRandom] Query error:', error)
      throw new Error(`Random products query failed: ${error.message}`)
    }

    const all = data as ProductListingDto[] || []
    const shuffled = all.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, limit).map(SupabaseMapper.toProductEntity)
  }
}
