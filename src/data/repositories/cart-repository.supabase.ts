import type { Cart, CartItem } from '@/domain/entities'
import type { CartRepository } from '@/domain/repositories/cart-repository'
import { supabase } from '@/data/supabase/client'
import { SupabaseMapper } from '@/data/mappers/supabase-mapper'
import type { ProductListingDto } from '@/data/dtos/supabase'

interface CartItemRow {
  id: string
  product_id: string
  quantity: number
  unit_price: number | string
  total_price: number | string
}

function buildCartEntity(
  cartId: string,
  items: CartItemRow[],
  products: Map<string, ProductListingDto>,
): Cart {
  const cartItems: CartItem[] = items
    .filter((i) => products.has(i.product_id))
    .map((i) => ({
      id: i.id,
      product: SupabaseMapper.toProductEntity(products.get(i.product_id)!),
      quantity: i.quantity,
      unitPrice: Number(i.unit_price),
      totalPrice: Number(i.total_price),
    }))

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0)
  const tax = 0
  const total = subtotal + tax

  return {
    id: cartId,
    items: cartItems,
    subtotal,
    tax,
    total,
    itemCount: cartItems.length,
  }
}

export class SupabaseCartRepository implements CartRepository {
  private async getOrCreateCart(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User must be authenticated to use cart')

    const { data: existingCart } = await supabase
      .from('abn_carts')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    if (existingCart) return existingCart.id

    const { data: newCart, error } = await supabase
      .from('abn_carts')
      .insert({ user_id: user.id, status: 'active' })
      .select('id')
      .single()

    if (error) throw new Error(`Failed to create cart: ${error.message}`)
    return newCart.id
  }

  async get(): Promise<Cart> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return buildCartEntity('empty', [], new Map())

    const { data: cart } = await supabase
      .from('abn_carts')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    if (!cart) return buildCartEntity('empty', [], new Map())

    const { data: items, error } = await supabase
      .from('abn_cart_items')
      .select('id, product_id, quantity, unit_price, total_price')
      .eq('cart_id', cart.id)
      .order('created_at', { ascending: true })

    if (error) throw new Error(`Failed to fetch cart items: ${error.message}`)

    if (!items || items.length === 0) {
      return buildCartEntity(cart.id, [], new Map())
    }

    const productIds = items.map((i) => i.product_id)
    const { data: products } = await supabase
      .from('product_listing')
      .select('*')
      .in('id', productIds)

    const productMap = new Map<string, ProductListingDto>()
    for (const p of products || []) {
      productMap.set(p.id, p as ProductListingDto)
    }

    return buildCartEntity(cart.id, items as CartItemRow[], productMap)
  }

  async addItem(item: CartItem): Promise<Cart> {
    const cartId = await this.getOrCreateCart()

    const { data: existing } = await supabase
      .from('abn_cart_items')
      .select('id, quantity, unit_price, total_price')
      .eq('cart_id', cartId)
      .eq('product_id', item.product.id)
      .maybeSingle()

    if (existing) {
      const newQuantity = existing.quantity + item.quantity
      const unitPrice = Number(existing.unit_price)
      const newTotal = unitPrice * newQuantity

      const { error } = await supabase
        .from('abn_cart_items')
        .update({ quantity: newQuantity, total_price: newTotal })
        .eq('id', existing.id)

      if (error) throw new Error(`Failed to update cart item: ${error.message}`)
    } else {
      const unitPrice = item.unitPrice || item.product.price
      const totalPrice = unitPrice * item.quantity

      const { error } = await supabase
        .from('abn_cart_items')
        .insert({
          cart_id: cartId,
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: unitPrice,
          total_price: totalPrice,
        })

      if (error) throw new Error(`Failed to add cart item: ${error.message}`)
    }

    return this.get()
  }

  async updateItem(itemId: string, quantity: number): Promise<Cart> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User must be authenticated')

    const { data: cart } = await supabase
      .from('abn_carts')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    if (!cart) throw new Error('No active cart found')

    const { data: cartItem } = await supabase
      .from('abn_cart_items')
      .select('unit_price')
      .eq('id', itemId)
      .eq('cart_id', cart.id)
      .maybeSingle()

    if (!cartItem) throw new Error('Cart item not found')

    const unitPrice = Number(cartItem.unit_price)
    const totalPrice = unitPrice * quantity

    const { error } = await supabase
      .from('abn_cart_items')
      .update({ quantity, total_price: totalPrice })
      .eq('id', itemId)

    if (error) throw new Error(`Failed to update cart item: ${error.message}`)

    return this.get()
  }

  async removeItem(itemId: string): Promise<Cart> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User must be authenticated')

    const { data: cart } = await supabase
      .from('abn_carts')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    if (!cart) throw new Error('No active cart found')

    const { error } = await supabase
      .from('abn_cart_items')
      .delete()
      .eq('id', itemId)
      .eq('cart_id', cart.id)

    if (error) throw new Error(`Failed to remove cart item: ${error.message}`)

    return this.get()
  }

  async clear(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: cart } = await supabase
      .from('abn_carts')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    if (!cart) return

    await supabase
      .from('abn_cart_items')
      .delete()
      .eq('cart_id', cart.id)
  }
}
