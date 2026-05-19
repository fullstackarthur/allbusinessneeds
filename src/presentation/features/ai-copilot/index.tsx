import * as React from 'react'
import { Sparkles } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { EmptyState } from '@/shared/components/ui/empty-state'

function AiCopilotPage() {
  const [query, setQuery] = React.useState('')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text">AI Sourcing Copilot</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Get intelligent product recommendations and sourcing insights
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="relative">
          <Input
            placeholder="Describe what you need - e.g., 'eco-friendly A4 paper for 50 employees'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {['Best value notebooks', 'Eco-friendly supplies', 'Bulk pricing options'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setQuery(suggestion)}
              className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-hover hover:text-text transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <EmptyState
        title="Start a conversation"
        description="Ask the AI copilot for product recommendations, pricing insights, or sourcing alternatives"
        icon={<Sparkles className="h-8 w-8" />}
      />
    </div>
  )
}

export { AiCopilotPage }
