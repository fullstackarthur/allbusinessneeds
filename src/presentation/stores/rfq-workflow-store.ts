import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { RfqItem, RfqContact, RfqDelivery, RfqStatus } from '@/core/types/rfq-schemas'
import type { FileAttachment } from '@/shared/components/ui/attachment-uploader'
import { generateId } from '@/core/utils/helpers'

export type RfqStep = 'cart' | 'review' | 'details' | 'confirmation'

interface RfqWorkflowState {
  step: RfqStep
  items: RfqItem[]
  contact: RfqContact | null
  delivery: RfqDelivery | null
  notes: string
  urgency: 'standard' | 'urgent' | 'critical'
  budgetRange: string
  attachments: FileAttachment[]
  reference: string | null
  status: RfqStatus
  submittedAt: string | null
  error: string | null
  _hasHydrated: boolean

  setStep: (step: RfqStep) => void
  addItem: (item: RfqItem) => void
  updateItem: (itemId: string, updates: Partial<RfqItem>) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  setContact: (contact: RfqContact) => void
  setDelivery: (delivery: RfqDelivery) => void
  setNotes: (notes: string) => void
  setUrgency: (urgency: 'standard' | 'urgent' | 'critical') => void
  setBudgetRange: (range: string) => void
  setAttachments: (attachments: FileAttachment[]) => void
  submit: () => void
  reset: () => void
  clearError: () => void
  canProceed: () => boolean
  getItemCount: () => number
  getEstimatedTotal: () => number
  getCategories: () => string[]
  _setHasHydrated: () => void
}

export const useRfqWorkflowStore = create<RfqWorkflowState>()(
  persist(
    (set, get) => ({
      step: 'cart',
      items: [],
      contact: null,
      delivery: null,
      notes: '',
      urgency: 'standard',
      budgetRange: '',
      attachments: [],
      reference: null,
      status: 'draft',
      submittedAt: null,
      error: null,
      _hasHydrated: false,

      setStep: (step) => set({ step, error: null }),

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.product_id === item.product_id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product_id === item.product_id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
            }
          }
          return { items: [...state.items, { ...item, id: item.id || generateId() }] }
        })
      },

      updateItem: (itemId, updates) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, ...updates } : i,
          ),
        }))
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        }))
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity < 1) return
        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i,
          ),
        }))
      },

      setContact: (contact) => set({ contact }),

      setDelivery: (delivery) => set({ delivery }),

      setNotes: (notes) => set({ notes }),

      setUrgency: (urgency) => set({ urgency }),

      setBudgetRange: (budgetRange) => set({ budgetRange }),

      setAttachments: (attachments) => set({ attachments }),

      submit: () => {
        const reference = `RFQ-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`
        set({
          reference,
          status: 'submitted',
          submittedAt: new Date().toISOString(),
          step: 'confirmation',
        })
      },

      reset: () => {
        set({
          step: 'cart',
          items: [],
          contact: null,
          delivery: null,
          notes: '',
          urgency: 'standard',
          budgetRange: '',
          attachments: [],
          reference: null,
          status: 'draft',
          submittedAt: null,
          error: null,
        })
      },

      clearError: () => set({ error: null }),

      canProceed: () => {
        const { step, items, contact } = get()
        if (step === 'cart') return items.length > 0
        if (step === 'review') return items.length > 0
        if (step === 'details') return contact !== null
        return false
      },

      getItemCount: () => get().items.length,

      getEstimatedTotal: () => {
        return get().items.reduce((sum, item) => {
          const price = item.unit_price || item.target_price || 0
          return sum + price * item.quantity
        }, 0)
      },

      getCategories: () => {
        const categories = new Set(get().items.map((i) => i.category).filter(Boolean))
        return Array.from(categories) as string[]
      },

      _setHasHydrated: () => set({ _hasHydrated: true }),
    }),
    {
      name: 'abn-rfq-workflow',
      partialize: (state) => ({
        items: state.items,
        contact: state.contact,
        delivery: state.delivery,
        notes: state.notes,
        urgency: state.urgency,
        budgetRange: state.budgetRange,
        reference: state.reference,
        status: state.status,
        submittedAt: state.submittedAt,
      }),
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._setHasHydrated()
        }
      },
    },
  ),
)
