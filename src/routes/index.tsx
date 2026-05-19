import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/presentation/shells/app-shell'
import { ROUTES } from '@/core/constants'

import { HomePage } from '@/presentation/features/home'
import { CategoriesPage } from '@/presentation/features/categories'
import { AiCopilotPage } from '@/presentation/features/ai-copilot'
import { RfqWorkflowPage, RfqHistoryPage } from '@/presentation/features/rfq'
import { AccountPage } from '@/presentation/features/account'
import { ProductDetailPage } from '@/presentation/features/product'
import { ProductListingPage } from '@/presentation/features/product-listing'
import { SearchPage } from '@/presentation/features/search'
import { BrandsPage } from '@/presentation/features/brands'
import { useRfqWorkflowStore } from '@/presentation/stores/rfq-workflow-store'
import { useEffect } from 'react'

function CartRoute() {
  const setStep = useRfqWorkflowStore((state) => state.setStep)
  useEffect(() => { setStep('cart') }, [setStep])
  return <RfqWorkflowPage />
}

function CheckoutRoute() {
  const setStep = useRfqWorkflowStore((state) => state.setStep)
  useEffect(() => { setStep('review') }, [setStep])
  return <RfqWorkflowPage />
}

function RfqReviewRoute() {
  const setStep = useRfqWorkflowStore((state) => state.setStep)
  useEffect(() => { setStep('review') }, [setStep])
  return <RfqWorkflowPage />
}

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    errorElement: (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-text">Page not found</h1>
          <p className="mt-2 text-text-secondary">The page you are looking for does not exist.</p>
        </div>
      </div>
    ),
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.CATEGORIES, element: <CategoriesPage /> },
      { path: ROUTES.AI_COPILOT, element: <AiCopilotPage /> },
      { path: ROUTES.RFQS, element: <RfqHistoryPage /> },
      { path: ROUTES.RFQ_WORKFLOW, element: <RfqWorkflowPage /> },
      { path: ROUTES.RFQ_REVIEW, element: <RfqReviewRoute /> },
      { path: ROUTES.CART, element: <CartRoute /> },
      { path: ROUTES.CHECKOUT, element: <CheckoutRoute /> },
      { path: ROUTES.ACCOUNT, element: <AccountPage /> },
      { path: ROUTES.PRODUCT, element: <ProductDetailPage /> },
      { path: '/products', element: <ProductListingPage /> },
      { path: '/categories/:slug', element: <ProductListingPage /> },
      { path: '/search', element: <SearchPage /> },
      { path: '/brands', element: <BrandsPage /> },
      { path: '/brands/:id', element: <ProductListingPage /> },
    ],
  },
])
