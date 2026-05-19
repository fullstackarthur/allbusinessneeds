import type { Cart, CartItem } from '@/domain/entities'
import type { CartRepository } from '@/domain/repositories/cart-repository'

export class GetCart {
  repository: CartRepository

  constructor(repository: CartRepository) {
    this.repository = repository
  }

  async execute(): Promise<Cart> {
    return this.repository.get()
  }
}

export class AddToCart {
  repository: CartRepository

  constructor(repository: CartRepository) {
    this.repository = repository
  }

  async execute(item: CartItem): Promise<Cart> {
    return this.repository.addItem(item)
  }
}

export class UpdateCartItem {
  repository: CartRepository

  constructor(repository: CartRepository) {
    this.repository = repository
  }

  async execute(itemId: string, quantity: number): Promise<Cart> {
    return this.repository.updateItem(itemId, quantity)
  }
}

export class RemoveFromCart {
  repository: CartRepository

  constructor(repository: CartRepository) {
    this.repository = repository
  }

  async execute(itemId: string): Promise<Cart> {
    return this.repository.removeItem(itemId)
  }
}

export class ClearCart {
  repository: CartRepository

  constructor(repository: CartRepository) {
    this.repository = repository
  }

  async execute(): Promise<void> {
    return this.repository.clear()
  }
}
