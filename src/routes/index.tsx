import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/presentation/shells/app-shell'
import { AuthProvider } from '@/presentation/providers/auth-provider'
import { ProtectedRoute } from '@/presentation/components/shared/protected-route'

import { LandingPage } from '@/presentation/features/landing-page'
import { CustomerAuthPage } from '@/presentation/features/customer-auth'
import { AdminPage } from '@/presentation/features/admin'
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
    element: (
      <AuthProvider>
        <LandingPage />
      </AuthProvider>
    ),
  },
  {
    path: '/whoami/customer',
    element: (
      <AuthProvider>
        <CustomerAuthPage />
      </AuthProvider>
    ),
  },
  {
    path: '/whoami/admin',
    element: <AdminPage />,
  },
  {
    path: '/experience',
    element: (
      <AuthProvider>
        <ExperienceShell />
      </AuthProvider>
    ),
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
      { path: 'rfq', element: <RfqWorkflowPage /> },
      { path: 'rfq/review', element: <RfqReviewRoute /> },
      { path: 'cart', element: <CartRoute /> },
      { path: 'checkout', element: <CheckoutRoute /> },
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
