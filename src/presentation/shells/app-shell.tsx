import { Outlet, useLocation } from 'react-router-dom'
import { MobileBottomNav, DesktopHeader } from '@/presentation/components/navigation'
import { RfqReviewBar } from '@/presentation/components/shared/rfq-review-bar'
import { SearchOverlay } from '@/presentation/components/shared/search-overlay'
import { AiCopilotPanel } from '@/presentation/components/shared/ai-copilot-panel'
import { useAuthStore } from '@/presentation/stores/auth-store'
import { useEffect, useRef } from 'react'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function VisitTracker() {
  const { pathname } = useLocation()
  const { user } = useAuthStore()
  const trackedRef = useRef<string>('')

  useEffect(() => {
    if (pathname === trackedRef.current) return
    trackedRef.current = pathname

    const productId = pathname.startsWith('/experience/products/')
      ? pathname.split('/').pop()
      : undefined

    import('@/core/container').then((m) => {
      m.useCases.auth.logVisit.execute(
        user?.id || null,
        pathname,
        productId
      ).catch(() => {})
    })
  }, [pathname, user])

  return null
}

function AppShell() {
  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      <VisitTracker />
      <DesktopHeader />
      <main className="pb-16 lg:pb-0">
        <div className="container-safe py-4 lg:py-6">
          <Outlet />
        </div>
      </main>
      <MobileBottomNav />
      <RfqReviewBar />
      <SearchOverlay />
      <AiCopilotPanel />
    </div>
  )
}

export { AppShell }
