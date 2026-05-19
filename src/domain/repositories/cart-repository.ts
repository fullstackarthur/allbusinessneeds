import type { Cart, CartItem } from '@/domain/entities'

export interface CartRepository {
  get(): Promise<Cart>
  addItem(product: CartItem): Promise<Cart>
  updateItem(itemId: string, quantity: number): Promise<Cart>
  removeItem(itemId: string): Promise<Cart>
  clear(): Promise<void>
}
