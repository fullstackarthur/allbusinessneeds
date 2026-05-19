import { RfqReviewPage } from './review-page'
import { RfqDetailsPage } from './details-page'
import { RfqConfirmationPage } from './confirmation-page'
import { RfqHistoryPage } from './history-page'
import { useRfqWorkflowStore } from '@/presentation/stores/rfq-workflow-store'

function RfqPage() {
  const step = useRfqWorkflowStore((state) => state.step)

  switch (step) {
    case 'review':
      return <RfqReviewPage />
    case 'details':
      return <RfqDetailsPage />
    case 'confirmation':
      return <RfqConfirmationPage />
    default:
      return <RfqReviewPage />
  }
}

export { RfqPage, RfqHistoryPage }
