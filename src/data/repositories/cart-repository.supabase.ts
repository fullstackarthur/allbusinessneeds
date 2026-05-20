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
  product: ProductListingDto | null
}

function buildCartEntity(
  cartId: string,
  items: {
    id: string
    product_id: string
    quantity: number
    unit_price: number
    total_price: number
    product: ProductListingDto | null
  }[]
): Cart {
  const cartItems: CartItem[] = items
    .filter((i) => i.product)
    .map((i) => ({
      id: i.id,
      product: SupabaseMapper.toProductEntity(i.product!),
      quantity: i.quantity,
      unitPrice: i.unit_price,
      totalPrice: i.total_price,
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
      .single()

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
    if (!user) return buildCartEntity('empty', [])

    const { data: cart } = await supabase
      .from('abn_carts')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (!cart) return buildCartEntity('empty', [])

    const { data: items, error } = await supabase
      .from('abn_cart_items')
      .select(`
        id,
        product_id,
        quantity,
        unit_price,
        total_price,
        product:product_id (
          id, slug, title, is_master_product, product_url,
          brand_name, category_name, category_slug,
          mrp, our_price, offer_price, discount_pct,
          in_stock, min_order_quantity, max_order_quantity,
          primary_image_url, search_tags, procurement_tags,
          unit_of_measure, created_at
        )
      `)
      .eq('cart_id', cart.id)
      .order('created_at', { ascending: true })

    if (error) throw new Error(`Failed to fetch cart items: ${error.message}`)

    return buildCartEntity(
      cart.id,
      (items || []).map((item: CartItemRow) => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: Number(item.unit_price),
        total_price: Number(item.total_price),
        product: item.product as ProductListingDto | null,
      }))
    )
  }

  async addItem(item: CartItem): Promise<Cart> {
    const cartId = await this.getOrCreateCart()

    const { data: existing } = await supabase
      .from('abn_cart_items')
      .select('id, quantity, unit_price, total_price')
      .eq('cart_id', cartId)
      .eq('product_id', item.product.id)
      .single()

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
      .single()

    if (!cart) throw new Error('No active cart found')

    const { data: cartItem } = await supabase
      .from('abn_cart_items')
      .select('unit_price')
      .eq('id', itemId)
      .eq('cart_id', cart.id)
      .single()

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
      .single()

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
      .single()

    if (!cart) return

    await supabase
      .from('abn_cart_items')
      .delete()
      .eq('cart_id', cart.id)
  }
}
