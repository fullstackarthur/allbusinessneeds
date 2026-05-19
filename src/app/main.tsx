import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/routes'
import { QueryProvider } from '@/presentation/providers/query-provider'
import { ErrorBoundary } from '@/shared/components/error-boundary'
import { useUiStore } from '@/presentation/stores/ui-store'
import '@/app/styles/globals.css'

window.addEventListener('error', (e) => {
  console.error('[Global Error]', e.error || e.message)
})

window.addEventListener('unhandledrejection', (e) => {
  console.error('[Unhandled Rejection]', e.reason)
})

function KeyboardShortcuts() {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        useUiStore.getState().setSearchOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return null
}

function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <KeyboardShortcuts />
        <RouterProvider router={router} />
      </QueryProvider>
    </ErrorBoundary>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
