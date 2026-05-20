import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/presentation/stores/auth-store'
import { useEffect } from 'react'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isInitialized, user } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    console.log('[ProtectedRoute] State:', { isInitialized, user: user?.email })
  }, [isInitialized, user])

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf9f7]">
        <div className="text-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0033a0] border-t-transparent mx-auto" />
          <p className="mt-3 text-sm text-[#718096]">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/whoami/customer" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export { ProtectedRoute }
