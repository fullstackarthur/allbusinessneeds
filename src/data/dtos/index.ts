export interface ProductDto {
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
  min_order_quantity: number
  images: string[]
  thumbnail: string
  attributes: Record<string, string>
  rating: number
  review_count: number
  created_at: string
  updated_at: string
}

export interface ProductListDto {
  data: ProductDto[]
  meta: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

export interface CategoryDto {
  id: string
  name: string
  slug: string
  description: string
  icon?: string
  product_count: number
  parent_category_id?: string
  children?: CategoryDto[]
}

export interface CartItemDto {
  id: string
  product: ProductDto
  quantity: number
  unit_price: number
  total_price: number
}

export interface CartDto {
  id: string
  items: CartItemDto[]
  subtotal: number
  tax: number
  total: number
  item_count: number
}

export interface RfqItemDto {
  product_id: string
  product_name: string
  quantity: number
  specifications?: string
  target_price?: number
}

export interface RfqDto {
  id: string
  reference: string
  items: RfqItemDto[]
  status: 'draft' | 'submitted' | 'reviewing' | 'quoted' | 'accepted' | 'rejected' | 'expired'
  notes?: string
  total_items: number
  created_at: string
  updated_at: string
  expires_at?: string
}

export interface QuotationItemDto {
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface QuotationDto {
  id: string
  rfq_id: string
  supplier_id: string
  supplier_name: string
  items: QuotationItemDto[]
  subtotal: number
  tax: number
  total: number
  valid_until: string
  status: 'pending' | 'accepted' | 'rejected'
  notes?: string
  created_at: string
}

export interface UserDto {
  id: string
  name: string
  email: string
  company?: string
  role: 'buyer' | 'admin' | 'supplier'
  avatar?: string
  created_at: string
}

export interface AiSuggestionDto {
  id: string
  type: 'product' | 'supplier' | 'pricing' | 'alternative'
  title: string
  description: string
  confidence: number
  metadata: Record<string, unknown>
}
