import { Outlet } from 'react-router-dom'
import { MobileBottomNav, DesktopHeader } from '@/presentation/components/navigation'
import { RfqReviewBar } from '@/presentation/components/shared/rfq-review-bar'

function AppShell() {
  return (
    <div className="min-h-screen bg-background">
      <DesktopHeader />
      <main className="pb-16 lg:pb-0">
        <div className="container-safe py-4 lg:py-6">
          <Outlet />
        </div>
      </main>
      <MobileBottomNav />
      <RfqReviewBar />
    </div>
  )
}

export { AppShell }
