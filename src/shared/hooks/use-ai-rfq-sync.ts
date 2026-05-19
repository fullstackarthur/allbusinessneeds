import * as React from 'react'
import { useRfqDraftStore } from '@/presentation/stores/rfq-draft-store'
import { useAiStore } from '@/presentation/stores/ai-store'

export function useAiRfqSync() {
  const rfqItems = useRfqDraftStore((state) => state.draft?.items || [])

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
}
