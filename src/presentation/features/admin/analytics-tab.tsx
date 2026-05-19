import * as React from 'react'

interface TopProduct {
  product_id: string
  visits: number
  title?: string
  sku?: string
}

function getUseCases() {
  return import('@/core/container').then((m) => m.useCases)
}

function getSupabase() {
  return import('@/data/supabase/client').then((m) => m.supabase)
}

function AnalyticsTab() {
  const [totalVisits, setTotalVisits] = React.useState(0)
  const [todayVisits, setTodayVisits] = React.useState(0)
  const [totalCustomers, setTotalCustomers] = React.useState(0)
  const [approvedUsers, setApprovedUsers] = React.useState(0)
  const [pendingUsers, setPendingUsers] = React.useState(0)
  const [topProducts, setTopProducts] = React.useState<TopProduct[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const uc = await getUseCases()
        const supabase = await getSupabase()

        const [allVisits, todayCount, profiles] = await Promise.all([
          uc.auth.getVisitCount.execute(),
          uc.auth.getVisitCount.execute(new Date().toISOString().split('T')[0]),
          uc.auth.getAllProfiles.execute(),
        ])

        setTotalVisits(allVisits)
        setTodayVisits(todayCount)
        setTotalCustomers(profiles.length)
        setApprovedUsers(profiles.filter((p) => p.status === 'approved').length)
        setPendingUsers(profiles.filter((p) => p.status === 'pending').length)

        const top = await uc.auth.getTopProducts.execute(10)

        if (top.length > 0) {
          const ids = top.map((t) => t.product_id)
          const { data: products } = await supabase
            .from('product_listing')
            .select('id, title, sku')
            .in('id', ids)

          const productMap: Record<string, { title?: string; sku?: string }> = {}
          for (const p of products || []) {
            productMap[p.id] = { title: p.title, sku: p.sku }
          }

          setTopProducts(
            top.map((t) => ({
              ...t,
              title: productMap[t.product_id]?.title || 'Unknown',
              sku: productMap[t.product_id]?.sku || '—',
            }))
          )
        }
      } catch (err) {
        console.error('[AnalyticsTab] Failed:', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0033a0] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-[#0a1628]">Analytics Overview</h2>
        <p className="mt-1 text-sm text-[#4a5568]">Platform usage and customer metrics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Visits" value={totalVisits.toLocaleString()} />
        <StatCard label="Today's Visits" value={todayVisits.toLocaleString()} />
        <StatCard label="Total Customers" value={totalCustomers.toString()} />
        <StatCard label="Approved Users" value={approvedUsers.toString()} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-2 gap-3">
        <div className="rounded-lg border border-[#e2e0dc] bg-white p-4">
          <h3 className="text-xs font-medium text-[#0a1628] mb-3">Registration Status</h3>
          <div className="space-y-2">
            <StatusRow label="Pending" count={pendingUsers} color="text-[#b8860b]" />
            <StatusRow label="Approved" count={approvedUsers} color="text-[#2d7a4f]" />
            <StatusRow label="Rejected" count={totalCustomers - approvedUsers - pendingUsers} color="text-[#c41e3a]" />
          </div>
        </div>

        <div className="rounded-lg border border-[#e2e0dc] bg-white p-4">
          <h3 className="text-xs font-medium text-[#0a1628] mb-3">Traffic Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[#718096]">Avg visits/day</span>
              <span className="font-medium text-[#0a1628]">{totalVisits > 0 ? Math.round(totalVisits / Math.max(1, Math.ceil(Date.now() / 86400000))) : 0}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#718096]">Today's share</span>
              <span className="font-medium text-[#0a1628]">{totalVisits > 0 ? Math.round((todayVisits / totalVisits) * 100) : 0}%</span>
            </div>
          </div>
        </div>
      </div>

      {topProducts.length > 0 && (
        <div className="rounded-lg border border-[#e2e0dc] bg-white">
          <div className="px-4 py-3 border-b border-[#e2e0dc]">
            <h3 className="text-xs font-medium text-[#0a1628]">Most Accessed Products</h3>
          </div>
          <div className="divide-y divide-[#e2e0dc]">
            {topProducts.map((product, i) => (
              <div key={product.product_id} className="flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-[#718096] w-5">{i + 1}</span>
                  <div>
                    <p className="text-xs font-medium text-[#0a1628]">{product.title}</p>
                    <p className="text-[10px] text-[#718096]">SKU: {product.sku}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-[#0033a0]">{product.visits} views</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#e2e0dc] bg-white p-4">
      <p className="text-xl font-semibold text-[#0a1628]">{value}</p>
      <p className="text-[10px] text-[#718096] mt-0.5">{label}</p>
    </div>
  )
}

function StatusRow({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${color.replace('text-', 'bg-')}`} />
        <span className="text-[#718096]">{label}</span>
      </div>
      <span className={`font-medium ${color}`}>{count}</span>
    </div>
  )
}

export { AnalyticsTab }
