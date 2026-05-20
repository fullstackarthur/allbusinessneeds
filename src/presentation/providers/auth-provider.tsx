import * as React from 'react'
import { supabase } from '@/data/supabase/client'
import { useAuthStore } from '@/presentation/stores/auth-store'
import type { ProfileDto } from '@/data/repositories/supabase-auth-repository'

function getUseCases() {
  return import('@/core/container').then((m) => m.useCases)
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const setSession = useAuthStore((s) => s.setSession)
  const setUser = useAuthStore((s) => s.setUser)
  const setProfile = useAuthStore((s) => s.setProfile)
  const setInitialized = useAuthStore((s) => s.setInitialized)
  const setLoading = useAuthStore((s) => s.setLoading)
  const clearAuth = useAuthStore((s) => s.clear)

  React.useEffect(() => {
    let cancelled = false

    async function fetchProfileWithTimeout(userId: string, timeoutMs = 5000): Promise<ProfileDto | null> {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
        
        const uc = await getUseCases()
        const profile = await uc.auth.getProfile.execute(userId)
        clearTimeout(timeoutId)
        return profile
      } catch (err) {
        console.error('[Auth] Profile fetch error:', err)
        return null
      }
    }

    async function init() {
      try {
        setLoading(true)
        console.log('[Auth] Init: Getting session...')
        const { data } = await supabase.auth.getSession()
        if (cancelled) return

        setSession(data.session)
        setUser(data.session?.user ?? null)
        console.log('[Auth] Init: Session user:', data.session?.user?.email)

        // Set initialized immediately - profile fetch happens in background
        if (!cancelled) {
          setInitialized(true)
          setLoading(false)
        }

        // Fetch profile in background
        if (data.session?.user) {
          console.log('[Auth] Init: Fetching profile for', data.session.user.id)
          fetchProfileWithTimeout(data.session.user.id).then((profile) => {
            if (!cancelled) {
              setProfile(profile ? mapProfile(profile) : null)
              console.log('[Auth] Init: Profile set:', profile?.status)
            }
          }).catch((err) => {
            console.error('[Auth] Init profile error:', err)
          })
        } else {
          if (!cancelled) setProfile(null)
        }
      } catch (err) {
        console.error('[Auth] Init error:', err)
        if (!cancelled) {
          setProfile(null)
          setInitialized(true)
          setLoading(false)
        }
      }
    }

    init()

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (cancelled) return

      console.log('[Auth] State change:', event, session?.user?.email)

      if (event === 'SIGNED_OUT') {
        if (!cancelled) {
          clearAuth()
          setInitialized(true)
          setLoading(false)
        }
        return
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setSession(session)
        setUser(session?.user ?? null)
        console.log('[Auth] Handler: Session user:', session?.user?.email)

        // Set initialized immediately - profile fetch happens in background
        if (!cancelled) {
          setInitialized(true)
          setLoading(false)
        }

        // Fetch profile in background
        if (session?.user) {
          console.log('[Auth] Handler: Fetching profile for', session.user.id)
          fetchProfileWithTimeout(session.user.id).then((profile) => {
            if (!cancelled) {
              setProfile(profile ? mapProfile(profile) : null)
              console.log('[Auth] Handler: Profile set:', profile?.status)
            }
          }).catch((err) => {
            console.error('[Auth] Handler profile error:', err)
          })
        } else {
          if (!cancelled) setProfile(null)
        }
        return
      }

      // For any other events, ensure initialized is set
      if (!cancelled) {
        console.log('[Auth] Other event:', event, '- setting initialized=true')
        setInitialized(true)
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
      listener.subscription.unsubscribe()
    }
  }, [setSession, setUser, setProfile, setInitialized, setLoading, clearAuth])

  return <>{children}</>
}

function mapProfile(dto: ProfileDto) {
  return {
    id: dto.id,
    name: dto.name,
    business_name: dto.business_name,
    email: dto.email,
    status: dto.status as 'pending' | 'approved' | 'rejected',
  }
}

export { AuthProvider }
