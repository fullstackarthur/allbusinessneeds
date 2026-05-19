import { create } from 'zustand'
import type { AiResponseBlock, AiRequest } from '@/core/types/ai-schemas'
import { generateId } from '@/core/utils/helpers'
import { useCases } from '@/core/container'

export interface AiMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  blocks: AiResponseBlock[]
  timestamp: string
  confidence?: number
}

export interface AiSessionContext {
  currentRfqItems: Array<{ product_id: string; product_name: string; quantity: number }>
  activeCategory: string | null
  viewedProducts: string[]
  procurementType: string | null
  lastQuery: string | null
}

interface AiState {
  sessionId: string
  messages: AiMessage[]
  context: AiSessionContext
  isTyping: boolean
  isProcessing: boolean
  error: string | null
  isOpen: boolean

  initialize: () => void
  sendMessage: (message: string) => Promise<void>
  analyzeProduct: (productId: string, context?: string) => Promise<void>
  suggestComplementary: () => Promise<void>
  updateContext: (updates: Partial<AiSessionContext>) => void
  clearSession: () => void
  setOpen: (open: boolean) => void
  dismissError: () => void
}

export const useAiStore = create<AiState>()((set, get) => ({
  sessionId: generateId(),
  messages: [],
  context: {
    currentRfqItems: [],
    activeCategory: null,
    viewedProducts: [],
    procurementType: null,
    lastQuery: null,
  },
  isTyping: false,
  isProcessing: false,
  error: null,
  isOpen: false,

  initialize: () => {
    const current = get()
    if (current.messages.length === 0) {
      set({
        messages: [
          {
            id: generateId(),
            role: 'system',
            blocks: [
              {
                type: 'text',
                content: 'How can I assist with your procurement today? I can help with product recommendations, RFQ analysis, sourcing alternatives, and quantity guidance.',
              },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      })
    }
  },

  sendMessage: async (message: string) => {
    const { sessionId, context } = get()

    const userMessage: AiMessage = {
      id: generateId(),
      role: 'user',
      blocks: [{ type: 'text', content: message }],
      timestamp: new Date().toISOString(),
    }

    set((state) => ({
      messages: [...state.messages, userMessage],
      isProcessing: true,
      error: null,
      context: { ...state.context, lastQuery: message },
    }))

    try {
      const request: AiRequest = {
        message,
        session_id: sessionId,
        context: {
          current_rfq_items: context.currentRfqItems,
          active_category: context.activeCategory || undefined,
          viewed_products: context.viewedProducts.length > 0 ? context.viewedProducts : undefined,
          procurement_type: context.procurementType || undefined,
        },
      }

      const response = await useCases.ai.chat.execute(request)

      const assistantMessage: AiMessage = {
        id: generateId(),
        role: 'assistant',
        blocks: response.blocks,
        timestamp: new Date().toISOString(),
        confidence: response.confidence,
      }

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isProcessing: false,
      }))
    } catch {
      set({
        isProcessing: false,
        error: 'Unable to process your request. Please try again.',
      })
    }
  },

  analyzeProduct: async (productId: string, contextStr?: string) => {
    set((state) => ({
      isProcessing: true,
      error: null,
      context: {
        ...state.context,
        viewedProducts: [...new Set([...state.context.viewedProducts, productId])],
      },
    }))

    try {
      const response = await useCases.ai.analyzeProduct.execute(productId, contextStr || '')

      const assistantMessage: AiMessage = {
        id: generateId(),
        role: 'assistant',
        blocks: response.blocks,
        timestamp: new Date().toISOString(),
        confidence: response.confidence,
      }

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isProcessing: false,
      }))
    } catch {
      set({
        isProcessing: false,
        error: 'Unable to analyze this product. Please try again.',
      })
    }
  },

  suggestComplementary: async () => {
    const { context } = get()

    if (context.currentRfqItems.length === 0) return

    set({ isProcessing: true, error: null })

    try {
      const response = await useCases.ai.suggestComplementary.execute(context.currentRfqItems)

      const assistantMessage: AiMessage = {
        id: generateId(),
        role: 'assistant',
        blocks: response.blocks,
        timestamp: new Date().toISOString(),
        confidence: response.confidence,
      }

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isProcessing: false,
      }))
    } catch {
      set({
        isProcessing: false,
        error: 'Unable to generate suggestions. Please try again.',
      })
    }
  },

  updateContext: (updates: Partial<AiSessionContext>) => {
    set((state) => ({
      context: { ...state.context, ...updates },
    }))
  },

  clearSession: () => {
    set({
      sessionId: generateId(),
      messages: [
        {
          id: generateId(),
          role: 'system',
          blocks: [
            {
              type: 'text',
              content: 'Session cleared. How can I assist with your procurement today?',
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
      context: {
        currentRfqItems: [],
        activeCategory: null,
        viewedProducts: [],
        procurementType: null,
        lastQuery: null,
      },
      error: null,
    })
  },

  setOpen: (open: boolean) => set({ isOpen: open }),

  dismissError: () => set({ error: null }),
}))
