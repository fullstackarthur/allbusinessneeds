import type { Product, Category, Cart, CartItem, Rfq, RfqItem, Quotation, QuotationItem, User, AiSuggestion } from '@/domain/entities'
import type {
  ProductDto,
  CategoryDto,
  CartDto,
  CartItemDto,
  RfqDto,
  RfqItemDto,
  QuotationDto,
  QuotationItemDto,
  UserDto,
  AiSuggestionDto,
} from '@/data/dtos'

export class ProductMapper {
  static toEntity(dto: ProductDto): Product {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      sku: dto.sku,
      category: dto.category,
      subcategory: dto.subcategory,
      brand: dto.brand,
      price: dto.price,
      currency: dto.currency,
      stock: dto.stock,
      minOrderQuantity: dto.min_order_quantity,
      images: dto.images,
      thumbnail: dto.thumbnail,
      attributes: dto.attributes,
      rating: dto.rating,
      reviewCount: dto.review_count,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
    }
  }

  static toDto(entity: Product): ProductDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      sku: entity.sku,
      category: entity.category,
      subcategory: entity.subcategory,
      brand: entity.brand,
      price: entity.price,
      currency: entity.currency,
      stock: entity.stock,
      min_order_quantity: entity.minOrderQuantity,
      images: entity.images,
      thumbnail: entity.thumbnail,
      attributes: entity.attributes,
      rating: entity.rating,
      review_count: entity.reviewCount,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    }
  }
}

export class CategoryMapper {
  static toEntity(dto: CategoryDto): Category {
    return {
      id: dto.id,
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      icon: dto.icon,
      productCount: dto.product_count,
      parentCategoryId: dto.parent_category_id,
      children: dto.children?.map((c) => CategoryMapper.toEntity(c)),
    }
  }
}

export class CartMapper {
  static toEntity(dto: CartDto): Cart {
    return {
      id: dto.id,
      items: dto.items.map(CartMapper.itemToEntity),
      subtotal: dto.subtotal,
      tax: dto.tax,
      total: dto.total,
      itemCount: dto.item_count,
    }
  }

  static itemToEntity(dto: CartItemDto): CartItem {
    return {
      id: dto.id,
      product: ProductMapper.toEntity(dto.product),
      quantity: dto.quantity,
      unitPrice: dto.unit_price,
      totalPrice: dto.total_price,
    }
  }
}

export class RfqMapper {
  static toEntity(dto: RfqDto): Rfq {
    return {
      id: dto.id,
      reference: dto.reference,
      items: dto.items.map(RfqMapper.itemToEntity),
      status: dto.status,
      notes: dto.notes,
      totalItems: dto.total_items,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
      expiresAt: dto.expires_at,
    }
  }

  static itemToEntity(dto: RfqItemDto): RfqItem {
    return {
      productId: dto.product_id,
      productName: dto.product_name,
      quantity: dto.quantity,
      specifications: dto.specifications,
      targetPrice: dto.target_price,
    }
  }
}

export class QuotationMapper {
  static toEntity(dto: QuotationDto): Quotation {
    return {
      id: dto.id,
      rfqId: dto.rfq_id,
      supplierId: dto.supplier_id,
      supplierName: dto.supplier_name,
      items: dto.items.map(QuotationMapper.itemToEntity),
      subtotal: dto.subtotal,
      tax: dto.tax,
      total: dto.total,
      validUntil: dto.valid_until,
      status: dto.status,
      notes: dto.notes,
      createdAt: dto.created_at,
    }
  }

  static itemToEntity(dto: QuotationItemDto): QuotationItem {
    return {
      productId: dto.product_id,
      productName: dto.product_name,
      quantity: dto.quantity,
      unitPrice: dto.unit_price,
      totalPrice: dto.total_price,
    }
  }
}

export class UserMapper {
  static toEntity(dto: UserDto): User {
    return {
      id: dto.id,
      name: dto.name,
      email: dto.email,
      company: dto.company,
      role: dto.role,
      avatar: dto.avatar,
      createdAt: dto.created_at,
    }
  }
}

export class AiSuggestionMapper {
  static toEntity(dto: AiSuggestionDto): AiSuggestion {
    return {
      id: dto.id,
      type: dto.type,
      title: dto.title,
      description: dto.description,
      confidence: dto.confidence,
      metadata: dto.metadata,
    }
  }
}
