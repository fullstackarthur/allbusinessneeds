import * as React from 'react'
import { useRfqDraftStore } from '@/presentation/stores/rfq-draft-store'
import { useRfqWorkflowStore } from '@/presentation/stores/rfq-workflow-store'

export function useRfqSync() {
  const draftItems = useRfqDraftStore((state) => state.draft?.items || [])
  const addItem = useRfqWorkflowStore((state) => state.addItem)
  const workflowItems = useRfqWorkflowStore((state) => state.items)

  React.useEffect(() => {
    if (draftItems.length === 0) return

    const workflowIds = new Set(workflowItems.map((i) => i.product_id))

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
  }, [draftItems, addItem, workflowItems])
}
