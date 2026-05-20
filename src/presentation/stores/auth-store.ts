import { create } from 'zustand'
import type { Session, User } from '@supabase/supabase-js'

export type ProfileStatus = 'pending' | 'approved' | 'rejected' | null

interface Profile {
  id: string
  name: string
  business_name: string
  email: string
  status: ProfileStatus
}

interface AuthState {
  session: Session | null
  user: User | null
  profile: Profile | null
  isLoading: boolean
  isInitialized: boolean
  setSession: (session: Session | null) => void
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  isInitialized: false,
  setSession: (session) => set({ session }),
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  setInitialized: (isInitialized) => set({ isInitialized }),
  clear: () => set({ session: null, user: null, profile: null }),
}))
