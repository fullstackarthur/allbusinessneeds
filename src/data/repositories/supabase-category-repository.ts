import type { Category } from '@/domain/entities'
import type { CategoryRepository } from '@/domain/repositories/category-repository'
import { supabase } from '@/data/supabase/client'
import { SupabaseMapper } from '@/data/mappers/supabase-mapper'
import type { CategoryDto } from '@/data/dtos/supabase'

export class SupabaseCategoryRepository implements CategoryRepository {
  async getAll(): Promise<Category[]> {
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (categoriesError) throw new Error(`Categories query failed: ${categoriesError.message}`)

    const categories = (categoriesData as CategoryDto[] || []).map(SupabaseMapper.toCategoryEntity)

    const { data: counts, error: countsError } = await supabase
      .from('product_listing')
      .select('category_slug')
      .then((res) => {
        if (res.error) return { data: null, error: res.error }
        const grouped = res.data.reduce<Record<string, number>>((acc, item) => {
          const slug = item.category_slug
          acc[slug] = (acc[slug] || 0) + 1
          return acc
        }, {})
        return { data: grouped, error: null }
      })

    if (countsError) {
      console.warn('[SupabaseCategoryRepository] Failed to fetch product counts:', countsError.message)
      return categories
    }

    return categories.map((cat) => ({
      ...cat,
      productCount: counts?.[cat.slug] || 0,
    }))
  }

  async getById(id: string): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw new Error(`Category not found: ${error.message}`)

    return SupabaseMapper.toCategoryEntity(data as CategoryDto)
  }

  async getBySlug(slug: string): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw new Error(`Category not found: ${error.message}`)

    return SupabaseMapper.toCategoryEntity(data as CategoryDto)
  }

  async getTree(): Promise<Category[]> {
    return this.getAll()
  }
}
