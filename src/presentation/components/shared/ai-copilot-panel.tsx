import { cn } from '@/shared/lib/utils'
import { useAiStore } from '@/presentation/stores/ai-store'
import { AiBlockRenderer } from '@/presentation/components/shared/ai-block-renderer'
import { AiTypingIndicator } from '@/presentation/components/shared/ai-loading'
import { useRfqDraftStore } from '@/presentation/stores/rfq-draft-store'
import type { AiProduct } from '@/core/types/ai-schemas'
import { Send, Sparkles, X, AlertCircle, RotateCcw } from 'lucide-react'
import * as React from 'react'

const quickPrompts = [
  { label: 'Recommend alternatives', prompt: 'Suggest cost-effective alternatives for my current RFQ items' },
  { label: 'Analyze RFQ', prompt: 'Analyze my current RFQ and suggest improvements' },
  { label: 'Find bundles', prompt: 'Suggest product bundles that complement my order' },
  { label: 'Quantity guidance', prompt: 'What quantities should I order for a team of 50?' },
]

function AiCopilotPanel() {
  const [input, setInput] = React.useState('')
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  const messages = useAiStore((state) => state.messages)
  const isProcessing = useAiStore((state) => state.isProcessing)
  const error = useAiStore((state) => state.error)
  const isOpen = useAiStore((state) => state.isOpen)
  const sendMessage = useAiStore((state) => state.sendMessage)
  const clearSession = useAiStore((state) => state.clearSession)
  const setOpen = useAiStore((state) => state.setOpen)
  const dismissError = useAiStore((state) => state.dismissError)
  const initialize = useAiStore((state) => state.initialize)

  const rfqItems = useRfqDraftStore((state) => state.draft?.items || [])

  React.useEffect(() => {
    initialize()
  }, [initialize])

  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isProcessing])

  React.useEffect(() => {
    useAiStore.setState({
      context: {
        ...useAiStore.getState().context,
        currentRfqItems: rfqItems.map((item) => ({
          product_id: item.productId,
          product_name: item.productName,
          quantity: item.quantity,
        })),
      },
    })
  }, [rfqItems])

  const handleSubmit = () => {
    const trimmed = input.trim()
    if (!trimmed || isProcessing) return
    sendMessage(trimmed)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleAddToRfq = (product: AiProduct) => {
    useRfqDraftStore.getState().initialize()
    useRfqDraftStore.getState().addItem({
      productId: product.id,
      productName: product.name,
      quantity: 1,
    })
  }

  const handleAddAllToRfq = (products: AiProduct[]) => {
    useRfqDraftStore.getState().initialize()
    products.forEach((product) => {
      useRfqDraftStore.getState().addItem({
        productId: product.id,
        productName: product.name,
        quantity: 1,
      })
    })
  }

  const handleClarificationResponse = (answer: string) => {
    sendMessage(answer)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background sm:py-4 sm:px-4">
      <div className="mx-auto flex h-full max-w-3xl flex-col sm:h-auto sm:rounded-xl sm:border sm:border-border sm:bg-surface sm:shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text">AI Sourcing Copilot</h2>
              <p className="text-xs text-text-muted">Procurement intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={clearSession}
              className="rounded-md p-2 text-text-muted hover:bg-surface-hover hover:text-text transition-colors"
              aria-label="Clear session"
              title="Clear session"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md p-2 text-text-muted hover:bg-surface-hover hover:text-text transition-colors sm:hidden"
              aria-label="Close AI copilot"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'user' && 'justify-end',
              )}
            >
              {message.role === 'assistant' && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-muted mt-0.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </div>
              )}

              <div
                className={cn(
                  'max-w-[85%] rounded-lg px-4 py-3',
                  message.role === 'user' && 'bg-primary text-primary-foreground',
                  message.role === 'assistant' && 'bg-surface-active',
                  message.role === 'system' && 'bg-surface-active border border-border',
                )}
              >
                {message.role === 'user' ? (
                  <p className="text-sm">{message.blocks[0]?.type === 'text' ? message.blocks[0].content : ''}</p>
                ) : (
                  <div className="space-y-4">
                    {message.blocks.map((block, index) => (
                      <AiBlockRenderer
                        key={index}
                        block={block}
                        onAddToRfq={handleAddToRfq}
                        onAddAllToRfq={handleAddAllToRfq}
                        onClarificationResponse={handleClarificationResponse}
                      />
                    ))}
                  </div>
                )}

                {message.confidence !== undefined && message.role === 'assistant' && (
                  <p className="mt-2 text-[10px] text-text-muted">
                    Confidence: {Math.round(message.confidence * 100)}%
                  </p>
                )}
              </div>
            </div>
          ))}

          {isProcessing && <AiTypingIndicator />}
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive-muted px-4 py-3">
              <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
              <button
                onClick={dismissError}
                className="ml-auto text-xs text-destructive hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length <= 1 && !isProcessing && (
          <div className="border-t border-border px-4 py-3">
            <p className="text-xs font-medium text-text-muted mb-2">Quick actions</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt.label}
                  onClick={() => {
                    sendMessage(prompt.prompt)
                  }}
                  className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-hover hover:text-text transition-colors"
                >
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border px-4 py-3 safe-bottom">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about products, pricing, or sourcing..."
              rows={1}
              className="flex-1 resize-none rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
              disabled={isProcessing}
            />
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || isProcessing}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { AiCopilotPanel }
