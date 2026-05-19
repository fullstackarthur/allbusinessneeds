import * as React from 'react'
import { supabase } from '@/data/supabase/client'
import { formatCurrency } from '@/core/utils/helpers'

interface ProductRow {
  id: string
  title: string
  brand_name: string | null
  category_name: string | null
  our_price: number | null
  offer_price: number | null
  in_stock: boolean | null
  min_order_quantity: number | null
  sku: string | null
  created_at: string
}

function DataTab() {
  const [products, setProducts] = React.useState<ProductRow[]>([])
  const [loading, setLoading] = React.useState(true)
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState('')
  const pageSize = 20

  React.useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        let query = supabase
          .from('product_listing')
          .select('*', { count: 'exact' })
          .range((page - 1) * pageSize, page * pageSize - 1)
          .order('created_at', { ascending: false })

        if (search.trim()) {
          query = query.ilike('title', `%${search.trim()}%`)
        }

        const { data, count } = await query
        setProducts((data || []) as ProductRow[])
        setTotal(count || 0)
      } catch (err) {
        console.error('[DataTab] Failed:', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [page, search])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#0a1628]">Product Data</h2>
          <p className="mt-1 text-sm text-[#4a5568]">
            {total} product{total !== 1 ? 's' : ''} in catalog
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search products..."
          className="flex-1 h-9 px-3 rounded-lg border border-[#e2e0dc] bg-white text-sm text-[#0a1628] placeholder:text-[#718096] focus:outline-none focus:ring-2 focus:ring-[#0033a0]/20 focus:border-[#0033a0]"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0033a0] border-t-transparent" />
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-lg border border-[#e2e0dc] bg-white p-8 text-center">
          <p className="text-sm text-[#718096]">No products found</p>
        </div>
      ) : (
        <>
          <div className="rounded-lg border border-[#e2e0dc] bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#e2e0dc] bg-[#f5f4f2]">
                    <th className="text-left px-3 py-2.5 font-medium text-[#4a5568]">Product</th>
                    <th className="text-left px-3 py-2.5 font-medium text-[#4a5568]">Brand</th>
                    <th className="text-left px-3 py-2.5 font-medium text-[#4a5568]">Category</th>
                    <th className="text-right px-3 py-2.5 font-medium text-[#4a5568]">Price</th>
                    <th className="text-right px-3 py-2.5 font-medium text-[#4a5568]">Offer</th>
                    <th className="text-center px-3 py-2.5 font-medium text-[#4a5568]">Stock</th>
                    <th className="text-right px-3 py-2.5 font-medium text-[#4a5568]">Min Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e0dc]">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-[#f5f4f2]/50">
                      <td className="px-3 py-2">
                        <div>
                          <p className="font-medium text-[#0a1628] truncate max-w-[200px]">{product.title}</p>
                          <p className="text-[10px] text-[#718096]">{product.sku || '—'}</p>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-[#4a5568]">{product.brand_name || '—'}</td>
                      <td className="px-3 py-2 text-[#4a5568]">{product.category_name || '—'}</td>
                      <td className="px-3 py-2 text-right text-[#4a5568]">
                        {product.our_price ? formatCurrency(product.our_price, 'INR') : '—'}
                      </td>
                      <td className="px-3 py-2 text-right font-medium text-[#0a1628]">
                        {product.offer_price ? formatCurrency(product.offer_price, 'INR') : '—'}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] ${
                          product.in_stock
                            ? 'bg-[#e8f5ec] text-[#2d7a4f]'
                            : 'bg-[#fce8ec] text-[#c41e3a]'
                        }`}>
                          {product.in_stock ? 'In' : 'Out'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right text-[#4a5568]">{product.min_order_quantity || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#718096]">
                Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-2.5 py-1.5 text-xs rounded border border-[#e2e0dc] disabled:opacity-40 hover:bg-[#f5f4f2] transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<number[]>((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push(-1)
                    acc.push(p)
                    return acc
                  }, [])
                  .map((p, i) =>
                    p === -1 ? (
                      <span key={`e-${i}`} className="px-1 text-[#718096]">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-7 h-7 text-xs rounded transition-colors ${
                          p === page
                            ? 'bg-[#0033a0] text-white'
                            : 'hover:bg-[#f5f4f2]'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-2.5 py-1.5 text-xs rounded border border-[#e2e0dc] disabled:opacity-40 hover:bg-[#f5f4f2] transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export { DataTab }
