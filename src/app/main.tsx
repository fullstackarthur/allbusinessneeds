import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/routes'
import { QueryProvider } from '@/presentation/providers/query-provider'
import { ErrorBoundary } from '@/shared/components/error-boundary'
import { useUiStore } from '@/presentation/stores/ui-store'
import '@/app/styles/globals.css'

function KeyboardShortcuts() {
  const setSearchOpen = useUiStore((state) => state.setSearchOpen)

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setSearchOpen])

  return null
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryProvider>
        <KeyboardShortcuts />
        <RouterProvider router={router} />
      </QueryProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
