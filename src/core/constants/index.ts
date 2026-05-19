export const APP_NAME = 'All Business Needs'
export const APP_SHORT_NAME = 'ABN'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.allbusinessneeds.com'
export const API_VERSION = 'v1'
export const API_TIMEOUT = 15000

export const ROUTES = {
  HOME: '/',
  CATEGORIES: '/categories',
  AI_COPILOT: '/ai',
  RFQS: '/rfqs',
  RFQ_REVIEW: '/rfq/review',
  RFQ_DETAIL: '/rfqs/:id',
  RFQ_CREATE: '/rfq/review',
  ACCOUNT: '/account',
  ACCOUNT_ORDERS: '/account/orders',
  ACCOUNT_ORDERS_DETAIL: '/account/orders/:id',
  ACCOUNT_SETTINGS: '/account/settings',
  PRODUCT: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  SEARCH: '/search',
} as const

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

export const MOBILE_BOTTOM_NAV_HEIGHT = 64
export const DESKTOP_SIDEBAR_WIDTH = 260
export const HEADER_HEIGHT = 56
export const SAFE_AREA_BOTTOM = 'env(safe-area-inset-bottom, 0px)'
