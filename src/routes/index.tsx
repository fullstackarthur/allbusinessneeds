import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/presentation/shells/app-shell'
import { ROUTES } from '@/core/constants'

import { HomePage } from '@/presentation/features/home'
import { CategoriesPage } from '@/presentation/features/categories'
import { AiCopilotPage } from '@/presentation/features/ai-copilot'
import { RfqsPage } from '@/presentation/features/rfq'
import { AccountPage } from '@/presentation/features/account'
import { ProductPage } from '@/presentation/features/product'
import { CartPage } from '@/presentation/features/cart'

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
      { path: ROUTES.RFQS, element: <RfqsPage /> },
      { path: ROUTES.RFQ_CREATE, element: <RfqsPage /> },
      { path: ROUTES.ACCOUNT, element: <AccountPage /> },
      { path: ROUTES.PRODUCT, element: <ProductPage /> },
      { path: ROUTES.CART, element: <CartPage /> },
    ],
  },
])
