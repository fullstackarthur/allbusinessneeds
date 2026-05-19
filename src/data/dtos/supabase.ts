export interface ProductListingDto {
  id: string
  slug: string
  title: string
  is_master_product: boolean | null
  product_url: string | null
  brand_name: string | null
  category_name: string | null
  category_slug: string | null
  mrp: number | string | null
  our_price: number | string | null
  offer_price: number | string | null
  discount_pct: number | string | null
  in_stock: boolean | null
  min_order_quantity: number | null
  max_order_quantity: number | null
  primary_image_url: string | null
  search_tags: string[] | null
  procurement_tags: string[] | null
  unit_of_measure: string | null
  created_at: string
}

export interface ProductDetailDto {
  id: string
  slug: string
  title: string
  is_master_product: boolean | null
  product_url: string | null
  brand_name: string | null
  category_name: string | null
  category_slug: string | null
  mrp: number | string | null
  our_price: number | string | null
  offer_price: number | string | null
  discount_pct: number | string | null
  in_stock: boolean | null
  min_order_quantity: number | null
  max_order_quantity: number | null
  specifications: Record<string, unknown> | null
  unit_of_measure: string | null
  spec_sheet_url: string | null
  search_tags: string[] | null
  procurement_tags: string[] | null
  images: { url: string }[] | null
  variations: { id: string; variation_name: string; variation_code: string | null }[] | null
  created_at: string
  updated_at: string
}

export interface CategoryDto {
  id: string
  slug: string
  name: string
  created_at: string
}

export interface N8nRfqPayload {
  rfq_ref: string
  contact_name: string
  contact_email: string
  contact_company: string
  contact_phone?: string
  line_items: {
    product_id: string
    title: string
    quantity: number
    unit?: string
    unit_price?: number
    subtotal?: number
    notes?: string
  }[]
  estimated_total: number
  rfq_notes?: string
  ai_summary?: Record<string, unknown>
}
