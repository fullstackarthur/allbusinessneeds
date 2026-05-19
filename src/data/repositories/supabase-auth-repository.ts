import { supabase } from '@/data/supabase/client'

export interface ProfileDto {
  id: string
  name: string
  business_name: string
  email: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

export interface AdminLoginDto {
  email: string
  password_hash: string
}

export class SupabaseAuthRepository {
  async signUp(email: string, password: string, name: string, businessName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, business_name: businessName },
      },
    })

    if (error) throw error
    return { user: data.user, session: data.session }
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return { user: data.user, session: data.session }
  }

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  async getSession() {
    const { data } = await supabase.auth.getSession()
    return { session: data.session }
  }

  async getCurrentUser() {
    const { data } = await supabase.auth.getUser()
    return { user: data.user }
  }

  async getProfile(userId: string): Promise<ProfileDto | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) return null
    return data as ProfileDto
  }

  async getAllProfiles(): Promise<ProfileDto[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []) as ProfileDto[]
  }

  async updateProfileStatus(userId: string, status: 'approved' | 'rejected') {
    const { data, error } = await supabase
      .from('profiles')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data as ProfileDto
  }

  async logVisit(userId: string | null, path: string, productId?: string) {
    await supabase.from('visits').insert({
      user_id: userId,
      path,
      product_id: productId || null,
    })
  }

  async getVisitCount(fromDate?: string) {
    let query = supabase.from('visits').select('*', { count: 'exact', head: true })
    if (fromDate) query = query.gte('visited_at', fromDate)
    const { count, error } = await query
    if (error) throw error
    return count || 0
  }

  async getTopProducts(limit = 10) {
    const { data, error } = await supabase
      .from('visits')
      .select('product_id')
      .not('product_id', 'is', null)
      .order('visited_at', { ascending: false })
      .limit(1000)

    if (error) throw error

    const counts: Record<string, number> = {}
    for (const v of data || []) {
      if (v.product_id) {
        counts[v.product_id] = (counts[v.product_id] || 0) + 1
      }
    }

    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([id, count]) => ({ product_id: id, visits: count }))
  }

  async getAdminUser(email: string): Promise<AdminLoginDto | null> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) return null
    return data as AdminLoginDto
  }
}
