import * as React from 'react'
import { useRfqDraftStore } from '@/presentation/stores/rfq-draft-store'
import { useAiStore } from '@/presentation/stores/ai-store'

export function useAiRfqSync() {
  const rfqItems = useRfqDraftStore((state) => state.draft?.items || [])
  const prevRef = React.useRef('')

  React.useEffect(() => {
    const key = rfqItems.map((i) => `${i.productId}:${i.quantity}`).join(',')
    if (key === prevRef.current) return
    prevRef.current = key

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
}
