import * as React from 'react'
import { cn } from '@/shared/lib/utils'

export interface ToasterProps {
  toasts: Array<{
    id: string
    title?: string
    description?: string
    variant?: 'default' | 'success' | 'destructive'
    action?: React.ReactNode
  }>
  onDismiss: (id: string) => void
}

export function Toaster({ toasts, onDismiss }: ToasterProps) {
  return (
    <div className="fixed bottom-4 right-4 z-100 flex flex-col gap-2 sm:bottom-6 sm:right-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex w-full max-w-sm items-start gap-3 rounded-lg border border-border bg-surface p-4 shadow-lg animate-slide-up',
            toast.variant === 'success' && 'border-success/30 bg-success-muted',
            toast.variant === 'destructive' && 'border-destructive/30 bg-destructive-muted',
          )}
        >
          <div className="flex-1">
            {toast.title && (
              <p className={cn(
                'text-sm font-medium',
                toast.variant === 'success' && 'text-success',
                toast.variant === 'destructive' && 'text-destructive',
              )}>
                {toast.title}
              </p>
            )}
            {toast.description && (
              <p className="mt-1 text-sm text-text-secondary">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="shrink-0 rounded p-1 text-text-muted hover:text-text transition-colors"
            aria-label="Dismiss"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
