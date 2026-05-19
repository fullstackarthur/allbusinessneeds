import * as React from 'react'
import { useRfqDraftStore } from '@/presentation/stores/rfq-draft-store'
import { useRfqWorkflowStore } from '@/presentation/stores/rfq-workflow-store'

export function useRfqSync() {
  const draftItems = useRfqDraftStore((state) => state.draft?.items || [])
  const addItem = useRfqWorkflowStore((state) => state.addItem)
  const syncedRef = React.useRef(false)

  React.useEffect(() => {
    if (draftItems.length === 0) return
    if (syncedRef.current) return

    syncedRef.current = true

    const workflowIds = new Set(useRfqWorkflowStore.getState().items.map((i) => i.product_id))

    draftItems.forEach((item) => {
      if (!workflowIds.has(item.productId)) {
        addItem({
          id: item.productId,
          product_id: item.productId,
          product_name: item.productName,
          quantity: item.quantity,
          target_price: item.targetPrice,
          specifications: item.specifications,
        })
      }
    })
  }, [draftItems, addItem])
}
