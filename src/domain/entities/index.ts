export interface Product {
  id: string
  name: string
  description: string
  sku: string
  category: string
  subcategory?: string
  brand?: string
  price: number
  currency: string
  stock: number
  minOrderQuantity: number
  images: string[]
  thumbnail: string
  attributes: Record<string, string>
  rating: number
  reviewCount: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon?: string
  productCount: number
  parentCategoryId?: string
  children?: Category[]
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Cart {
  id: string
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  itemCount: number
}

export interface RfqItem {
  productId: string
  productName: string
  quantity: number
  specifications?: string
  targetPrice?: number
}

export interface Rfq {
  id: string
  reference: string
  items: RfqItem[]
  status: 'draft' | 'submitted' | 'reviewing' | 'quoted' | 'accepted' | 'rejected' | 'expired'
  notes?: string
  totalItems: number
  createdAt: string
  updatedAt: string
  expiresAt?: string
  quotations?: Quotation[]
}

export interface Quotation {
  id: string
  rfqId: string
  supplierId: string
  supplierName: string
  items: QuotationItem[]
  subtotal: number
  tax: number
  total: number
  validUntil: string
  status: 'pending' | 'accepted' | 'rejected'
  notes?: string
  createdAt: string
}

export interface QuotationItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Supplier {
  id: string
  name: string
  rating: number
  responseTime: string
  totalQuotations: number
  verified: boolean
}

export interface User {
  id: string
  name: string
  email: string
  company?: string
  role: 'buyer' | 'admin' | 'supplier'
  avatar?: string
  createdAt: string
}

export interface AiSuggestion {
  id: string
  type: 'product' | 'supplier' | 'pricing' | 'alternative'
  title: string
  description: string
  confidence: number
  metadata: Record<string, unknown>
}
