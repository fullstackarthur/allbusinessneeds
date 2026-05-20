import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { AnalyticsTab } from './analytics-tab'
import { UsersTab } from './users-tab'
import { DataTab } from './data-tab'

const ADMIN_PASSWORD_HASH = '15be68d868fb7df8734d03938541bd8a0761e717231e9becd74c7f601feb071b'

function getUseCases() {
  return import('@/core/container').then((m) => m.useCases)
}

function AdminPage() {
  const navigate = useNavigate()
  const [authenticated, setAuthenticated] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const uc = await getUseCases()
      const admin = await uc.auth.getAdminUser.execute(email)

      if (!admin) {
        setError('Invalid credentials')
        return
      }

      if (admin.password_hash !== ADMIN_PASSWORD_HASH) {
        setError('Invalid credentials')
        return
      }

      setAuthenticated(true)
    } catch {
      setError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 mb-3">
                <img src="/favicon.svg" alt="ABN" className="h-5 w-5" />
                <span className="text-sm font-medium text-[#0a1628] tracking-tight">All Business Needs</span>
              </div>
            <h1 className="text-base font-semibold text-[#0a1628]">Admin Panel</h1>
          </div>

          {error && (
            <div className="mb-4 p-2.5 rounded-lg border border-[#c41e3a]/20 bg-[#fce8ec]">
              <p className="text-xs text-[#c41e3a]">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="rounded-lg border border-[#e2e0dc] bg-white p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#0a1628] mb-1.5">Email</label>
              <Input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin email"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#0a1628] mb-1.5">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Verifying...' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-4 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-[#718096] hover:text-[#0a1628] transition-colors"
            >
              Back to home
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <header className="border-b border-[#e2e0dc] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="/favicon.svg" alt="ABN" className="h-5 w-5" />
              <span className="text-sm font-medium text-[#0a1628] tracking-tight">Admin Panel</span>
            </div>
            <Link to="/" className="text-sm text-[#718096] hover:text-[#0a1628] transition-colors">
              Back to home
            </Link>
          </div>
          <button
            onClick={() => { setAuthenticated(false); setEmail(''); setPassword('') }}
            className="text-sm text-[#718096] hover:text-[#0a1628] transition-colors"
          >
            Sign Out
          </button>
        </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="analytics">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>
          <TabsContent value="users">
            <UsersTab />
          </TabsContent>
          <TabsContent value="data">
            <DataTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export { AdminPage }
