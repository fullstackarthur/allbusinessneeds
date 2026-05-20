import type { Cart, CartItem } from '@/domain/entities'
import type { CartRepository } from '@/domain/repositories/cart-repository'

const STORAGE_KEY = 'abn_cart'

function generateId(): string {
  return Math.random().toString(36).slice(2, 11)
}

function getStoredCart(): Cart {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        id: parsed.id || generateId(),
        items: parsed.items || [],
        itemCount: parsed.items?.length || 0,
        subtotal: parsed.subtotal || 0,
        tax: parsed.tax || 0,
        total: parsed.total || 0,
      }
    }
  } catch {
    // ignore parse errors
  }
  return { id: generateId(), items: [], itemCount: 0, subtotal: 0, tax: 0, total: 0 }
}

function saveCart(cart: Cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
}

function calculateTotals(items: CartItem[]): { subtotal: number; tax: number; total: number } {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)
  const tax = subtotal * 0.1
  return { subtotal, tax, total: subtotal + tax }
}

export class LocalStorageCartRepository implements CartRepository {
  async get(): Promise<Cart> {
    return getStoredCart()
  }

  async addItem(item: CartItem): Promise<Cart> {
    const cart = getStoredCart()
    const existing = cart.items.find((i) => i.product.id === item.product.id)

    if (existing) {
      existing.quantity += item.quantity
      existing.totalPrice = existing.quantity * existing.unitPrice
    } else {
      cart.items.push({
        id: generateId(),
        product: item.product,
        quantity: item.quantity,
        unitPrice: item.unitPrice || item.product.price,
        totalPrice: (item.unitPrice || item.product.price) * item.quantity,
      })
    }

    cart.itemCount = cart.items.length
    const totals = calculateTotals(cart.items)
    cart.subtotal = totals.subtotal
    cart.tax = totals.tax
    cart.total = totals.total
    saveCart(cart)
    return cart
  }

  async updateItem(itemId: string, quantity: number): Promise<Cart> {
    const cart = getStoredCart()
    const item = cart.items.find((i) => i.id === itemId)

    if (item) {
      item.quantity = quantity
      item.totalPrice = item.quantity * item.unitPrice
      const totals = calculateTotals(cart.items)
      cart.subtotal = totals.subtotal
      cart.tax = totals.tax
      cart.total = totals.total
      saveCart(cart)
    }

    return cart
  }

  async removeItem(itemId: string): Promise<Cart> {
    const cart = getStoredCart()
    cart.items = cart.items.filter((i) => i.id !== itemId)
    cart.itemCount = cart.items.length
    const totals = calculateTotals(cart.items)
    cart.subtotal = totals.subtotal
    cart.tax = totals.tax
    cart.total = totals.total
    saveCart(cart)
    return cart
  }

  async clear(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY)
  }
}
