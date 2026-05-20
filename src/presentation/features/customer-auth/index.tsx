import * as React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/presentation/stores/auth-store'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'

import { supabase } from '@/data/supabase/client'

function getUseCases() {
  return import('@/core/container').then((m) => m.useCases)
}

function CustomerAuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname || '/experience'
  const { user, profile } = useAuthStore()

  const [mode, setMode] = React.useState<'signin' | 'signup'>(user && profile?.status === 'pending' ? 'signin' : 'signin')
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
      console.log('[SignIn] Starting sign in for:', email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('[SignIn] Supabase error:', error.message)
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.')
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please confirm your email address before signing in.')
        } else {
          setError(`Sign in failed: ${error.message}`)
        }
        return
      }

      if (!data.user) {
        setError('Sign in failed. Please try again.')
        return
      }

      console.log('[SignIn] User authenticated:', data.user.id)

      const uc = await getUseCases()
      let profile = await uc.auth.getProfile.execute(data.user.id)
      console.log('[SignIn] Profile:', profile)

      if (!profile) {
        // If profile doesn't exist, create one automatically
        console.log('[SignIn] Profile not found, creating new profile for user:', data.user.id)
        const userMetadata = data.user.user_metadata || {}
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name: userMetadata.name || data.user.email?.split('@')[0] || 'User',
            business_name: userMetadata.business_name || 'N/A',
            email: data.user.email || '',
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
        
        if (profileError) {
          console.error('[SignIn] Profile creation error:', profileError.message)
          setError(`Failed to create profile: ${profileError.message}`)
          return
        }

        // Fetch the newly created profile
        profile = await uc.auth.getProfile.execute(data.user.id)
        console.log('[SignIn] Newly created profile:', profile)
      }

      if (profile?.status === 'approved') {
        console.log('[SignIn] Approved, navigating to:', from)
        navigate(from, { replace: true })
      } else if (profile?.status === 'pending') {
        setError('Your account is pending admin approval. Please wait for confirmation.')
      } else if (profile?.status === 'rejected') {
        setError('Your registration was not approved. Please contact support.')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error('[SignIn] Caught error:', message)
      setError(`Sign in failed: ${message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, business_name: businessName },
        },
      })

      if (error) {
        console.error('[SignUp] Supabase error:', error.message)
        if (error.message.includes('User already registered')) {
          setError('An account with this email already exists. Please sign in instead.')
        } else if (error.message.includes('Password')) {
          setError('Password must be at least 6 characters.')
        } else {
          setError(`Registration failed: ${error.message}`)
        }
        return
      }

      if (data.user) {
        // Create profile record in the profiles table
        console.log('[SignUp] Creating profile for user:', data.user.id)
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name,
            business_name: businessName,
            email,
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
        
        if (profileError) {
          console.error('[SignUp] Profile creation error:', profileError.message)
          setError(`Failed to create profile: ${profileError.message}`)
          return
        }

        setSignupSuccess(true)
      } else {
        setError('Registration failed. Please try again.')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error('[SignUp] Caught error:', message)
      setError(`Registration failed: ${message}`)
    } finally {
      setLoading(false)
    }
  }

  if (signupSuccess) {
    return (
      <div className="min-h-screen bg-[#faf9f7]">
        <div className="border-b border-[#e2e0dc] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="w-5 h-5 bg-[#0033a0] rounded-sm" />
                <span className="text-sm font-semibold text-[#0a1628] tracking-tight">allbusinessneeds</span>
              </Link>
              <Link to="/" className="text-sm text-[#718096] hover:text-[#0a1628] transition-colors">
                Back to home
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-20">
          <div className="w-full max-w-md">
            <div className="rounded-xl border border-[#e2e0dc] bg-white p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e6eaf5]">
                <svg className="h-7 w-7 text-[#0033a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="mt-5 text-xl font-semibold text-[#0a1628]">Registration Submitted</h2>
              <p className="mt-3 text-base text-[#4a5568]">
                Your account is under review. You will receive access once an administrator approves your registration.
              </p>
              <Button onClick={() => setMode('signin')} className="mt-6 w-full">
                Back to Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="border-b border-[#e2e0dc] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-5 h-5 bg-[#0033a0] rounded-sm" />
              <span className="text-sm font-semibold text-[#0a1628] tracking-tight">allbusinessneeds</span>
            </Link>
            <Link to="/" className="text-sm text-[#718096] hover:text-[#0a1628] transition-colors">
              Back to home
            </Link>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-12 lg:py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-[#0a1628]">
              {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
            </h1>
            <p className="mt-2 text-base text-[#4a5568]">
              {mode === 'signin'
                ? 'Access your procurement workspace'
                : 'Register to access the procurement platform'}
            </p>
          </div>

          {user && profile?.status === 'pending' && (
            <div className="mb-6 p-4 rounded-xl border border-[#b8860b]/20 bg-[#fdf6e3]">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#b8860b]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-[#b8860b]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#b8860b]">Account Under Review</p>
                  <p className="mt-1 text-sm text-[#b8860b]/80">
                    Your registration is pending admin approval. You will be able to access the platform once approved.
                  </p>
                </div>
              </div>
            </div>
          )}

          {user && profile?.status === 'rejected' && (
            <div className="mb-6 p-4 rounded-xl border border-[#c41e3a]/20 bg-[#fce8ec]">
              <p className="text-sm text-[#c41e3a]">
                Your registration was not approved. Please contact support for assistance.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl border border-[#c41e3a]/20 bg-[#fce8ec]">
              <p className="text-sm text-[#c41e3a]">{error}</p>
            </div>
          )}

          <div className="rounded-xl border border-[#e2e0dc] bg-white p-6">
            <div className="flex gap-1 mb-6 p-1 bg-[#f5f4f2] rounded-lg">
              <button
                onClick={() => { setMode('signin'); setError(null) }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  mode === 'signin'
                    ? 'bg-white text-[#0a1628] shadow-sm'
                    : 'text-[#718096] hover:text-[#0a1628]'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setMode('signup'); setError(null) }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-colors ${
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
                  <label className="block text-sm font-medium text-[#0a1628] mb-1.5">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0a1628] mb-1.5">Password</label>
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
                  <label className="block text-sm font-medium text-[#0a1628] mb-1.5">Full Name</label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0a1628] mb-1.5">Business Name</label>
                  <Input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Acme Corporation"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0a1628] mb-1.5">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0a1628] mb-1.5">Password</label>
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
                <p className="text-xs text-[#718096] text-center">
                  New registrations require admin approval before accessing the platform.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export { CustomerAuthPage }
