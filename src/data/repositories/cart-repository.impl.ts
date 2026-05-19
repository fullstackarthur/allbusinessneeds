import type { Cart, CartItem } from '@/domain/entities'
import type { CartRepository } from '@/domain/repositories/cart-repository'
import { httpClient } from '@/core/http/client'
import { CartMapper } from '@/data/mappers'
import type { CartDto } from '@/data/dtos'

const CART_ENDPOINT = '/cart'

export class CartRepositoryImpl implements CartRepository {
  async get(): Promise<Cart> {
    const response = await httpClient.get<CartDto>(CART_ENDPOINT)
    return CartMapper.toEntity(response.data)
  }

  async addItem(item: CartItem): Promise<Cart> {
    const response = await httpClient.post<CartDto>(`${CART_ENDPOINT}/items`, {
      product_id: item.product.id,
      quantity: item.quantity,
    })
    return CartMapper.toEntity(response.data)
  }

  async updateItem(itemId: string, quantity: number): Promise<Cart> {
    const response = await httpClient.patch<CartDto>(`${CART_ENDPOINT}/items/${itemId}`, {
      quantity,
    })
    return CartMapper.toEntity(response.data)
  }

  async removeItem(itemId: string): Promise<Cart> {
    const response = await httpClient.delete<CartDto>(`${CART_ENDPOINT}/items/${itemId}`)
    return CartMapper.toEntity(response.data)
  }

  async clear(): Promise<void> {
    await httpClient.delete(CART_ENDPOINT)
  }
}
