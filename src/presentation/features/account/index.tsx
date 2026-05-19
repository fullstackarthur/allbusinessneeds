import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Button } from '@/shared/components/ui/button'
import { User, Package, FileText, Settings } from 'lucide-react'

function AccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text">Account</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Manage your profile and preferences
        </p>
      </div>

      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-muted">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-base font-medium text-text">Demo User</p>
            <p className="text-sm text-text-secondary">demo@allbusinessneeds.com</p>
            <p className="mt-0.5 text-xs text-text-muted">Acme Corporation</p>
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
                  <p className="text-2xl font-semibold text-text">12</p>
                  <p className="text-xs text-text-muted">Total Orders</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-text-muted" />
                <div>
                  <p className="text-2xl font-semibold text-text">5</p>
                  <p className="text-xs text-text-muted">Active RFQs</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-text-muted" />
                <div>
                  <p className="text-2xl font-semibold text-text">3</p>
                  <p className="text-xs text-text-muted">Saved Suppliers</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-4">
          <div className="rounded-lg border border-border bg-surface p-8 text-center">
            <p className="text-sm text-text-secondary">Order history will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <div className="space-y-4">
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
