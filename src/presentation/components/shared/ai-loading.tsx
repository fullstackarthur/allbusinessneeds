function AiTypingIndicator() {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-muted">
        <svg className="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
        </svg>
      </div>
      <div className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}

function AiMessageSkeleton() {
  return (
    <div className="space-y-3 py-2">
      <div className="flex items-center gap-3">
        <div className="h-7 w-7 rounded-full bg-surface-active animate-pulse" />
        <div className="h-3 w-20 rounded bg-surface-active animate-pulse" />
      </div>
      <div className="space-y-2 pl-10">
        <div className="h-3 w-full rounded bg-surface-active animate-pulse" />
        <div className="h-3 w-4/5 rounded bg-surface-active animate-pulse" />
        <div className="h-3 w-3/5 rounded bg-surface-active animate-pulse" />
      </div>
    </div>
  )
}

function AiProductCardSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
      <div className="h-12 w-12 shrink-0 rounded-md bg-surface-active animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-3/4 rounded bg-surface-active animate-pulse" />
        <div className="h-2 w-1/2 rounded bg-surface-active animate-pulse" />
      </div>
      <div className="h-6 w-16 rounded bg-surface-active animate-pulse" />
    </div>
  )
}

function AiLoadingState() {
  return (
    <div className="space-y-4 py-2">
      <AiMessageSkeleton />
      <div className="space-y-2 pl-10">
        <AiProductCardSkeleton />
        <AiProductCardSkeleton />
      </div>
    </div>
  )
}

export { AiTypingIndicator, AiMessageSkeleton, AiProductCardSkeleton, AiLoadingState }
