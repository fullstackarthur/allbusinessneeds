export const APP_NAME = 'All Business Needs'
export const APP_SHORT_NAME = 'ABN'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.allbusinessneeds.com'
export const API_VERSION = 'v1'
export const API_TIMEOUT = 15000
export const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || ''

const EXP = '/experience' as const

export const ROUTES = {
  HOME: '/',
  EXPERIENCE: EXP,
  EXPERIENCE_HOME: EXP,
  CATEGORIES: `${EXP}/categories`,
  AI_COPILOT: `${EXP}/ai`,
  RFQS: `${EXP}/rfqs`,
  RFQ_WORKFLOW: `${EXP}/rfq`,
  RFQ_REVIEW: `${EXP}/rfq/review`,
  RFQ_DETAIL: `${EXP}/rfqs/:id`,
  RFQ_CREATE: `${EXP}/rfq`,
  ACCOUNT: `${EXP}/account`,
  ACCOUNT_ORDERS: `${EXP}/account/orders`,
  ACCOUNT_ORDERS_DETAIL: `${EXP}/account/orders/:id`,
  ACCOUNT_SETTINGS: `${EXP}/account/settings`,
  PRODUCT: `${EXP}/products/:id`,
  CART: `${EXP}/cart`,
  CHECKOUT: `${EXP}/checkout`,
  SEARCH: `${EXP}/search`,
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
