'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const supabase = createClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      fetch('/api/meta/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: 'CompleteRegistration',
          email,
          event_source_url: window.location.href,
        }),
        keepalive: true,
      })
      router.push('/login?verify=true')
    }
  }

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-zinc-800">
      <div className="w-full max-w-xl min-h-[550px] bg-white backdrop-blur-md rounded-2xl shadow-2xl p-8">
        
        <div className="flex justify-center mb-4">
          <Link href="/">
            <Image
              src="/logo_4.png"
              alt="TextFlow Logo"
              width={60}
              height={60}
              className="rounded-md"
            />
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-zinc-800 mb-4 mt-2 text-center">
          Grow your business with SMS
        </h1>

        <ul className="text-sm text-zinc-600 mb-6 space-y-2">
          <li className="flex items-start gap-2">
            <Check className="text-emerald-500 w-4 h-4 mt-0.5" />
            SMS messages receive a 98% open rate
          </li>
          <li className="flex items-start gap-2">
            <Check className="text-emerald-500 w-4 h-4 mt-0.5" />
            Increase your response and conversion rates
          </li>
          <li className="flex items-start gap-2">
            <Check className="text-emerald-500 w-4 h-4 mt-0.5" />
            Send bulk promotions and marketing campaigns
          </li>
        </ul>

        <button
          className="w-full flex items-center justify-center gap-3 border border-zinc-300 rounded-md py-2 mb-6 hover:bg-zinc-100 transition"
          onClick={handleGoogleSignup}
        >
          <Image src="/logos/google.svg" alt="Google" width={20} height={20} />
          <span className="text-sm font-medium text-zinc-800">
            Sign up with Google
          </span>
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200"></div>
          </div>
          <div className="relative text-center">
            <span className="bg-white px-2 text-xs text-zinc-400">
              or sign up with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-2 border border-zinc-300 rounded-md text-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-4 py-2 border border-zinc-300 rounded-md text-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 text-white rounded-md py-2 hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        {error && (
          <p className="text-sm text-red-500 mt-4 text-center">{error}</p>
        )}

        <p className="text-sm text-zinc-600 mt-4 text-center">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-emerald-600 font-medium hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
