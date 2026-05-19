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

  React.useEffect(() => {
    let cancelled = false

    async function init() {
      setLoading(true)
      const { data } = await supabase.auth.getSession()
      if (cancelled) return

      setSession(data.session)
      setUser(data.session?.user ?? null)

      if (data.session?.user) {
        try {
          const uc = await getUseCases()
          const profile = await uc.auth.getProfile.execute(data.session.user.id)
          if (cancelled) return
          setProfile(profile ? mapProfile(profile) : null)
        } catch {
          if (!cancelled) setProfile(null)
        }
      }

      if (!cancelled) {
        setInitialized(true)
        setLoading(false)
      }
    }

    init()

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (cancelled) return

      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        try {
          const uc = await getUseCases()
          const profile = await uc.auth.getProfile.execute(session.user.id)
          if (!cancelled) setProfile(profile ? mapProfile(profile) : null)
        } catch {
          if (!cancelled) setProfile(null)
        }
      } else {
        setProfile(null)
      }
    })

    return () => {
      cancelled = true
      listener.subscription.unsubscribe()
    }
  }, [setSession, setUser, setProfile, setInitialized, setLoading])

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
