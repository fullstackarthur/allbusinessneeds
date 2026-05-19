import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/shared/lib/utils'
import { ROUTES } from '@/core/constants'
import { useRfqDraftStore } from '@/presentation/stores/rfq-draft-store'
import { useUiStore } from '@/presentation/stores/ui-store'
import {
  Home,
  Grid3X3,
  Sparkles,
  FileText,
  User,
  Search,
  ShoppingCart,
} from 'lucide-react'

const navItems = [
  { label: 'Home', icon: Home, href: ROUTES.HOME },
  { label: 'Categories', icon: Grid3X3, href: ROUTES.CATEGORIES },
  { label: 'AI', icon: Sparkles, href: ROUTES.AI_COPILOT },
  { label: 'RFQs', icon: FileText, href: ROUTES.RFQS },
  { label: 'Account', icon: User, href: ROUTES.ACCOUNT },
]

function MobileBottomNav() {
  const location = useLocation()
  const itemCount = useRfqDraftStore((state) => state.getItemCount())

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface safe-bottom lg:hidden"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-2 text-xs font-medium transition-colors',
                isActive ? 'text-primary' : 'text-text-muted hover:text-text',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.href === ROUTES.RFQS && itemCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

function DesktopHeader() {
  const location = useLocation()
  const itemCount = useRfqDraftStore((state) => state.getItemCount())
  const setSearchOpen = useUiStore((state) => state.setSearchOpen)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="container-safe flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <span className="text-sm font-bold text-primary-foreground">ABN</span>
            </div>
            <span className="hidden text-base font-semibold text-text sm:inline-block">
              All Business Needs
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Desktop navigation">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-muted text-primary'
                      : 'text-text-secondary hover:bg-surface-hover hover:text-text',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-muted hover:border-border-strong hover:text-text transition-colors"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden h-5 items-center gap-0.5 rounded border border-border bg-surface-active px-1.5 text-[10px] font-medium sm:inline-flex">
              Ctrl K
            </kbd>
          </button>

          <Link
            to={ROUTES.RFQS}
            className="relative rounded-md p-2 text-text-muted hover:bg-surface-hover hover:text-text transition-colors"
            aria-label={`RFQ draft${itemCount ? ` (${itemCount} items)` : ''}`}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          <Link
            to={ROUTES.ACCOUNT}
            className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-surface-active text-sm font-medium text-text-secondary hover:text-text transition-colors"
            aria-label="Account"
          >
            U
          </Link>
        </div>
      </div>
    </header>
  )
}

export { MobileBottomNav, DesktopHeader }
