import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/presentation/shells/app-shell'
import { ProtectedRoute } from '@/presentation/components/shared/protected-route'

import { LandingPage } from '@/presentation/features/landing-page'
import { CustomerAuthPage } from '@/presentation/features/customer-auth'
import { AdminPage } from '@/presentation/features/admin'
import { HomePage } from '@/presentation/features/home'
import { CategoriesPage } from '@/presentation/features/categories'
import { AiCopilotPage } from '@/presentation/features/ai-copilot'
import { RfqHistoryPage } from '@/presentation/features/rfq'
import { AccountPage } from '@/presentation/features/account'
import { ProductDetailPage } from '@/presentation/features/product'
import { ProductListingPage } from '@/presentation/features/product-listing'
import { SearchPage } from '@/presentation/features/search'
import { BrandsPage } from '@/presentation/features/brands'
import { CartPage } from '@/presentation/features/cart'

function ExperienceShell() {
  return (
    <ProtectedRoute>
      <AppShell />
    </ProtectedRoute>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/whoami/customer',
    element: <CustomerAuthPage />,
  },
  {
    path: '/whoami/admin',
    element: <AdminPage />,
  },
  {
    path: '/experience',
    element: <ExperienceShell />,
    errorElement: (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-text">Page not found</h1>
          <p className="mt-2 text-text-secondary">The page you are looking for does not exist.</p>
        </div>
      </div>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'ai', element: <AiCopilotPage /> },
      { path: 'rfqs', element: <RfqHistoryPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'account', element: <AccountPage /> },
      { path: 'products/:id', element: <ProductDetailPage /> },
      { path: 'products', element: <ProductListingPage /> },
      { path: 'categories/:slug', element: <ProductListingPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'brands', element: <BrandsPage /> },
      { path: 'brands/:id', element: <ProductListingPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
