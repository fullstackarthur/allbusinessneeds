import { useAuthStore } from '@/presentation/stores/auth-store'

function GlobalLoader() {
  const { isInitialized } = useAuthStore()

  if (isInitialized) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent mx-auto" />
        <p className="mt-4 text-sm text-text-secondary">Loading...</p>
      </div>
    </div>
  )
}

export { GlobalLoader }
