import { AiCopilotPanel } from '@/presentation/components/shared/ai-copilot-panel'
import { useAiStore } from '@/presentation/stores/ai-store'
import { Button } from '@/shared/components/ui/button'
import { Sparkles, MessageSquare, Package, FileText, TrendingUp } from 'lucide-react'

const aiCapabilities = [
  {
    icon: <Package className="h-5 w-5" />,
    title: 'Product Recommendations',
    description: 'Get intelligent product suggestions based on your procurement needs',
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: 'RFQ Analysis',
    description: 'Analyze your RFQ for optimization opportunities and cost savings',
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    title: 'Quantity Guidance',
    description: 'Receive data-driven quantity recommendations for your team size',
  },
  {
    icon: <MessageSquare className="h-5 w-5" />,
    title: 'Sourcing Intelligence',
    description: 'Ask about alternatives, compliance, and procurement best practices',
  },
]

function AiCopilotPage() {
  const setOpen = useAiStore((state) => state.setOpen)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text">AI Sourcing Copilot</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Procurement intelligence to accelerate your sourcing workflow
        </p>
      </div>

      {/* Main CTA */}
      <div className="rounded-xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-text">Start a procurement conversation</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Ask about products, request sourcing alternatives, analyze your RFQ, or get quantity recommendations
            </p>
          </div>
          <Button onClick={() => setOpen(true)} size="lg" className="shrink-0">
            <Sparkles className="mr-1.5 h-4 w-4" />
            Open Copilot
          </Button>
        </div>
      </div>

      {/* Capabilities */}
      <div>
        <h2 className="text-base font-semibold text-text">Capabilities</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {aiCapabilities.map((capability) => (
            <div
              key={capability.title}
              className="rounded-lg border border-border bg-surface p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-muted text-primary">
                {capability.icon}
              </div>
              <h3 className="mt-3 text-sm font-medium text-text">{capability.title}</h3>
              <p className="mt-1 text-xs text-text-secondary">{capability.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Example Queries */}
      <div>
        <h2 className="text-base font-semibold text-text">Example queries</h2>
        <div className="mt-4 space-y-2">
          {[
            'What are the best value A4 paper options for 100 employees?',
            'Suggest eco-friendly alternatives for my current order',
            'Analyze my RFQ and identify cost savings',
            'What complementary products should I add for a new office setup?',
            'Compare pricing between PaperPro and ValuePrint for bulk orders',
          ].map((query) => (
            <button
              key={query}
              onClick={() => {
                useAiStore.getState().initialize()
                useAiStore.getState().sendMessage(query)
                setOpen(true)
              }}
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-left text-sm text-text-secondary hover:border-border-strong hover:text-text transition-colors"
            >
              {query}
            </button>
          ))}
        </div>
      </div>

      {/* AI Panel */}
      <AiCopilotPanel />
    </div>
  )
}

export { AiCopilotPage }
