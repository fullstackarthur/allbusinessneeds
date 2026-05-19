import * as React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/presentation/stores/auth-store'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'

function getUseCases() {
  return import('@/core/container').then((m) => m.useCases)
}

function CustomerAuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname || '/experience'
  const isPending = (location.state as any)?.pending || false
  const { user, profile } = useAuthStore()

  const [mode, setMode] = React.useState<'signin' | 'signup'>(isPending ? 'signin' : 'signin')
  const [name, setName] = React.useState('')
  const [businessName, setBusinessName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [signupSuccess, setSignupSuccess] = React.useState(false)

  React.useEffect(() => {
    if (user && profile?.status === 'approved') {
      navigate(from, { replace: true })
    }
  }, [user, profile, navigate, from])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const uc = await getUseCases()
      await uc.auth.signIn.execute(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const uc = await getUseCases()
      await uc.auth.signUp.execute(email, password, name, businessName)
      setSignupSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  if (signupSuccess) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="rounded-lg border border-[#e2e0dc] bg-white p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e6eaf5]">
              <svg className="h-6 w-6 text-[#0033a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-[#0a1628]">Registration Submitted</h2>
            <p className="mt-2 text-sm text-[#4a5568]">
              Your account is under review. You will receive access once an administrator approves your registration.
            </p>
            <Button
              onClick={() => setMode('signin')}
              className="mt-6 w-full"
            >
              Back to Sign In
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-[#0033a0] rounded-sm" />
            <span className="text-sm font-medium text-[#0a1628] tracking-tight">allbusinessneeds</span>
          </Link>
          <h1 className="text-lg font-semibold text-[#0a1628]">
            {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
          </h1>
          <p className="mt-1 text-sm text-[#4a5568]">
            {mode === 'signin'
              ? 'Access your procurement workspace'
              : 'Register to access the procurement platform'}
          </p>
        </div>

        {isPending && (
          <div className="mb-4 p-3 rounded-lg border border-[#b8860b]/20 bg-[#fdf6e3]">
            <p className="text-xs text-[#b8860b]">
              Your account is pending approval. Please sign in to check your status.
            </p>
          </div>
        )}

        {profile?.status === 'pending' && user && (
          <div className="mb-4 p-3 rounded-lg border border-[#b8860b]/20 bg-[#fdf6e3]">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#b8860b]">
                Account pending admin approval
              </p>
              <Badge variant="warning" className="text-[10px]">Pending</Badge>
            </div>
          </div>
        )}

        {profile?.status === 'rejected' && user && (
          <div className="mb-4 p-3 rounded-lg border border-[#c41e3a]/20 bg-[#fce8ec]">
            <p className="text-xs text-[#c41e3a]">
              Your registration was not approved. Please contact support.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg border border-[#c41e3a]/20 bg-[#fce8ec]">
            <p className="text-xs text-[#c41e3a]">{error}</p>
          </div>
        )}

        <div className="rounded-lg border border-[#e2e0dc] bg-white p-6">
          <div className="flex gap-1 mb-6 p-1 bg-[#f5f4f2] rounded-lg">
            <button
              onClick={() => { setMode('signin'); setError(null) }}
              className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
                mode === 'signin'
                  ? 'bg-white text-[#0a1628] shadow-sm'
                  : 'text-[#718096] hover:text-[#0a1628]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(null) }}
              className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
                mode === 'signup'
                  ? 'bg-white text-[#0a1628] shadow-sm'
                  : 'text-[#718096] hover:text-[#0a1628]'
              }`}
            >
              Register
            </button>
          </div>

          {mode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#0a1628] mb-1.5">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#0a1628] mb-1.5">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#0a1628] mb-1.5">Full Name</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#0a1628] mb-1.5">Business Name</label>
                <Input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Acme Corporation"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#0a1628] mb-1.5">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#0a1628] mb-1.5">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </Button>
              <p className="text-[10px] text-[#718096] text-center">
                New registrations require admin approval before accessing the platform.
              </p>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-[#718096]">
          <Link to="/" className="hover:text-[#0a1628] transition-colors">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}

export { CustomerAuthPage }
