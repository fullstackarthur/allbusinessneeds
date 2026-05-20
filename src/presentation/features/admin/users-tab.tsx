import * as React from 'react'
import { Button } from '@/shared/components/ui/button'
import type { ProfileDto } from '@/data/repositories/supabase-auth-repository'

function getUseCases() {
  return import('@/core/container').then((m) => m.useCases)
}

function UsersTab() {
  const [profiles, setProfiles] = React.useState<ProfileDto[]>([])
  const [loading, setLoading] = React.useState(true)
  const [actionLoading, setActionLoading] = React.useState<string | null>(null)

  const loadProfiles = React.useCallback(async () => {
    setLoading(true)
    try {
      const uc = await getUseCases()
      const data = await uc.auth.getAllProfiles.execute()
      setProfiles(data)
    } catch (err) {
      console.error('[UsersTab] Failed:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadProfiles()
  }, [loadProfiles])

  const handleStatusChange = async (userId: string, status: 'approved' | 'rejected') => {
    setActionLoading(userId)
    try {
      const uc = await getUseCases()
      await uc.auth.updateProfileStatus.execute(userId, status)
      setProfiles((prev) =>
        prev.map((p) => (p.id === userId ? { ...p, status } : p))
      )
    } catch (err) {
      console.error('[UsersTab] Status update failed:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const pendingCount = profiles.filter((p) => p.status === 'pending').length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0033a0] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#0a1628]">User Management</h2>
          <p className="mt-1 text-sm text-[#4a5568]">
            {profiles.length} registered user{profiles.length !== 1 ? 's' : ''}
            {pendingCount > 0 && ` · ${pendingCount} pending`}
          </p>
        </div>
        <button
          onClick={loadProfiles}
          className="text-xs text-[#718096] hover:text-[#0a1628] transition-colors"
        >
          Refresh
        </button>
      </div>

      {profiles.length === 0 ? (
        <div className="rounded-lg border border-[#e2e0dc] bg-white p-8 text-center">
          <p className="text-sm text-[#718096]">No users registered yet</p>
        </div>
      ) : (
        <div className="rounded-lg border border-[#e2e0dc] bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#e2e0dc] bg-[#f5f4f2]">
                  <th className="text-left px-4 py-2.5 font-medium text-[#4a5568]">Name</th>
                  <th className="text-left px-4 py-2.5 font-medium text-[#4a5568]">Business</th>
                  <th className="text-left px-4 py-2.5 font-medium text-[#4a5568]">Email</th>
                  <th className="text-left px-4 py-2.5 font-medium text-[#4a5568]">Status</th>
                  <th className="text-left px-4 py-2.5 font-medium text-[#4a5568]">Date</th>
                  <th className="text-right px-4 py-2.5 font-medium text-[#4a5568]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e0dc]">
                {profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-[#f5f4f2]/50">
                    <td className="px-4 py-2.5 font-medium text-[#0a1628]">{profile.name}</td>
                    <td className="px-4 py-2.5 text-[#4a5568]">{profile.business_name}</td>
                    <td className="px-4 py-2.5 text-[#4a5568]">{profile.email}</td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={profile.status} />
                    </td>
                    <td className="px-4 py-2.5 text-[#718096]">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {profile.status === 'pending' && (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 px-2 text-[10px]"
                            onClick={() => handleStatusChange(profile.id, 'approved')}
                            disabled={actionLoading === profile.id}
                          >
                            {actionLoading === profile.id ? '...' : 'Approve'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 px-2 text-[10px] text-[#c41e3a] border-[#c41e3a]/20 hover:bg-[#fce8ec]"
                            onClick={() => handleStatusChange(profile.id, 'rejected')}
                            disabled={actionLoading === profile.id}
                          >
                            {actionLoading === profile.id ? '...' : 'Reject'}
                          </Button>
                        </div>
                      )}
                      {profile.status !== 'pending' && (
                        <span className="text-[#718096]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    pending: { label: 'Pending', className: 'bg-[#fdf6e3] text-[#b8860b] border-[#b8860b]/20' },
    approved: { label: 'Approved', className: 'bg-[#e8f5ec] text-[#2d7a4f] border-[#2d7a4f]/20' },
    rejected: { label: 'Rejected', className: 'bg-[#fce8ec] text-[#c41e3a] border-[#c41e3a]/20' },
  }
  const c = config[status as keyof typeof config] || config.pending

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${c.className}`}>
      {c.label}
    </span>
  )
}

export { UsersTab }
