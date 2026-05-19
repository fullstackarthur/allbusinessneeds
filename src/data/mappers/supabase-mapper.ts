import type { Product, Category } from '@/domain/entities'
import type { ProductListingDto, ProductDetailDto, CategoryDto } from '@/data/dtos/supabase'

function resolvePrice(dto: ProductListingDto | ProductDetailDto): number {
  const offer = Number(dto.offer_price)
  if (!isNaN(offer) && offer > 0) return offer
  const our = Number(dto.our_price)
  if (!isNaN(our) && our > 0) return our
  const mrp = Number(dto.mrp)
  if (!isNaN(mrp) && mrp > 0) return mrp
  return 0
}

function resolveImages(dto: ProductDetailDto): string[] {
  if (dto.images && dto.images.length > 0) {
    return dto.images.map((img) => img.url).filter(Boolean)
  }
  return []
}

function resolveAttributes(dto: ProductDetailDto): Record<string, string> {
  const attrs: Record<string, string> = {}
  if (dto.specifications) {
    Object.entries(dto.specifications).forEach(([key, value]) => {
      attrs[key] = String(value)
    })
  }
  if (dto.unit_of_measure) {
    attrs.unit_of_measure = dto.unit_of_measure
  }
  if (dto.search_tags?.length) {
    attrs.search_tags = dto.search_tags.join(', ')
  }
  return attrs
}

export class SupabaseMapper {
  static toProductEntity(dto: ProductListingDto | ProductDetailDto): Product {
    const isDetail = 'images' in dto
    const images = isDetail
      ? resolveImages(dto as ProductDetailDto)
      : (dto as ProductListingDto).primary_image_url
        ? [(dto as ProductListingDto).primary_image_url as string]
        : []

    return {
      id: dto.id,
      name: dto.title,
      description: '',
      sku: '',
      category: dto.category_name || '',
      subcategory: undefined,
      brand: dto.brand_name || undefined,
      price: resolvePrice(dto),
      currency: 'INR',
      stock: dto.in_stock ? 999 : 0,
      minOrderQuantity: dto.min_order_quantity || 1,
      images,
      thumbnail: images[0] || '',
      attributes: isDetail ? resolveAttributes(dto as ProductDetailDto) : {},
      rating: 0,
      reviewCount: 0,
      createdAt: dto.created_at,
      updatedAt: 'updated_at' in dto ? dto.updated_at : dto.created_at,
    }
  }

  static toCategoryEntity(dto: CategoryDto): Category {
    return {
      id: dto.id,
      name: dto.name,
      slug: dto.slug,
      description: '',
      icon: undefined,
      productCount: 0,
      parentCategoryId: undefined,
      children: undefined,
    }
  }
}
