import * as React from 'react'
import { useRfqDraftStore } from '@/presentation/stores/rfq-draft-store'
import { useAiStore } from '@/presentation/stores/ai-store'

export function useAiRfqSync() {
  const rfqItems = useRfqDraftStore((state) => state.draft?.items || [])
  const updateContext = useAiStore((state) => state.updateContext)
  const prevRef = React.useRef('')

  React.useEffect(() => {
    const key = rfqItems.map((i) => `${i.productId}:${i.quantity}`).join(',')
    if (key === prevRef.current) return
    prevRef.current = key

    updateContext({
      currentRfqItems: rfqItems.map((item) => ({
        product_id: item.productId,
        product_name: item.productName,
        quantity: item.quantity,
      })),
    })
  }, [rfqItems, updateContext])
}
