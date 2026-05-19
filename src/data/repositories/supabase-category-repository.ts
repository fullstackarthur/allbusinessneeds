import type { Category } from '@/domain/entities'
import type { CategoryRepository } from '@/domain/repositories/category-repository'
import { supabase } from '@/data/supabase/client'
import { SupabaseMapper } from '@/data/mappers/supabase-mapper'
import type { CategoryDto } from '@/data/dtos/supabase'

export class SupabaseCategoryRepository implements CategoryRepository {
  async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw new Error(`Categories query failed: ${error.message}`)

    return (data as CategoryDto[] || []).map(SupabaseMapper.toCategoryEntity)
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
