import { RfqCartPage } from './cart-page'
import { RfqReviewPage } from './review-page'
import { RfqDetailsPage } from './details-page'
import { RfqConfirmationPage } from './confirmation-page'
import { RfqHistoryPage } from './history-page'
import { useRfqWorkflowStore } from '@/presentation/stores/rfq-workflow-store'

function RfqWorkflowPage() {
  const step = useRfqWorkflowStore((state) => state.step)

  switch (step) {
    case 'cart':
      return <RfqCartPage />
    case 'review':
      return <RfqReviewPage />
    case 'details':
      return <RfqDetailsPage />
    case 'confirmation':
      return <RfqConfirmationPage />
    default:
      return <RfqCartPage />
  }
}

export { RfqWorkflowPage, RfqHistoryPage }
