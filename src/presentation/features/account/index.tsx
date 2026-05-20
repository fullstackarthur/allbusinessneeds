import { Link, useNavigate } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Button } from '@/shared/components/ui/button'
import { useAuthStore } from '@/presentation/stores/auth-store'
import { Package, FileText, Settings, LogOut, Mail, Building2 } from 'lucide-react'

function getUseCases() {
  return import('@/core/container').then((m) => m.useCases)
}

function AccountPage() {
  const navigate = useNavigate()
  const { user, profile } = useAuthStore()

  const handleSignOut = async () => {
    try {
      const uc = await getUseCases()
      await uc.auth.signOut.execute()
      console.log('[SignOut] Supabase sign out complete')
      // Wait a tick for auth state to propagate
      await new Promise((r) => setTimeout(r, 100))
      navigate('/', { replace: true })
    } catch (err) {
      console.error('[SignOut] Error:', err)
      navigate('/', { replace: true })
    }
  }

  const displayName = profile?.name || user?.email?.split('@')[0] || 'User'
  const initials = displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
  const email = profile?.email || user?.email || ''
  const businessName = profile?.business_name || ''

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text">Account</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage your profile and preferences
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-muted">
            <span className="text-lg font-semibold text-primary">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-medium text-text truncate">{displayName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Mail className="h-3.5 w-3.5 text-text-muted" />
              <p className="text-sm text-text-secondary truncate">{email}</p>
            </div>
            {businessName && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <Building2 className="h-3.5 w-3.5 text-text-muted" />
                <p className="text-xs text-text-muted truncate">{businessName}</p>
              </div>
            )}
          </div>
          <div className="shrink-0">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
              profile?.status === 'approved'
                ? 'bg-success-muted text-success'
                : profile?.status === 'pending'
                ? 'bg-warning-muted text-warning'
                : 'bg-destructive-muted text-destructive'
            }`}>
              {profile?.status === 'approved' ? 'Approved' : profile?.status === 'pending' ? 'Pending' : 'Rejected'}
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-text-muted" />
                <div>
                  <p className="text-2xl font-semibold text-text">0</p>
                  <p className="text-xs text-text-muted">Total Orders</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-text-muted" />
                <div>
                  <p className="text-2xl font-semibold text-text">0</p>
                  <p className="text-xs text-text-muted">Active RFQs</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-text-muted" />
                <div>
                  <p className="text-2xl font-semibold text-text">0</p>
                  <p className="text-xs text-text-muted">Saved Suppliers</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-4">
          <div className="rounded-lg border border-border bg-surface p-8 text-center">
            <Package className="h-8 w-8 text-text-muted mx-auto mb-3" />
            <p className="text-sm font-medium text-text">No orders yet</p>
            <p className="mt-1 text-xs text-text-muted">Your order history will appear here</p>
            <Link to="/experience">
              <Button variant="outline" size="sm" className="mt-4">
                Browse Catalog
              </Button>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-surface p-4">
              <h3 className="text-sm font-medium text-text">Profile Information</h3>
              <p className="mt-1 text-xs text-text-muted">Your name, email, and business details</p>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Name</span>
                  <span className="text-text">{displayName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Email</span>
                  <span className="text-text">{email}</span>
                </div>
                {businessName && (
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Business</span>
                    <span className="text-text">{businessName}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4">
              <h3 className="text-sm font-medium text-text">Notifications</h3>
              <p className="mt-1 text-xs text-text-muted">Manage email and push notifications</p>
              <Button variant="outline" size="sm" className="mt-3">
                Configure
              </Button>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4">
              <h3 className="text-sm font-medium text-text">Company Details</h3>
              <p className="mt-1 text-xs text-text-muted">Update your company information</p>
              <Button variant="outline" size="sm" className="mt-3">
                Edit
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export { AccountPage }
