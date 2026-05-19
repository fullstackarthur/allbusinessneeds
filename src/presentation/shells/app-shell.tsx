import { Outlet, useLocation } from 'react-router-dom'
import { MobileBottomNav, DesktopHeader } from '@/presentation/components/navigation'
import { RfqReviewBar } from '@/presentation/components/shared/rfq-review-bar'
import { SearchOverlay } from '@/presentation/components/shared/search-overlay'
import { AiCopilotPanel } from '@/presentation/components/shared/ai-copilot-panel'
import { useEffect } from 'react'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function AppShell() {
  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
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
