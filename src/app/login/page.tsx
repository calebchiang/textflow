'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showVerifyMsg, setShowVerifyMsg] = useState(false)

  useEffect(() => {
    if (searchParams.get('verify') === 'true') {
      setShowVerifyMsg(true)
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-emerald-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-zinc-800 mb-6 text-center">Log in to TextFlow</h1>

        {showVerifyMsg && (
        <div className="bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-md px-4 py-3 text-sm mb-4">
            ✅ Check your email to verify your account before logging in.
        </div>
        )}

        <button className="w-full flex items-center justify-center gap-3 border border-zinc-300 rounded-md py-2 mb-6 hover:bg-zinc-100 transition">
          <Image src="/logos/google.svg" alt="Google" width={20} height={20} />
          <span className="text-sm font-medium text-zinc-800">Continue with Google</span>
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200"></div>
          </div>
          <div className="relative text-center">
            <span className="bg-white px-2 text-xs text-zinc-400">or log in with email</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="px-4 py-2 border border-zinc-300 rounded-md text-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="px-4 py-2 border border-zinc-300 rounded-md text-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 text-white rounded-md py-2 hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        {error && <p className="text-sm text-red-500 mt-4 text-center">{error}</p>}

        <p className="text-sm text-zinc-600 mt-4 text-center">
          Don't have an account?{' '}
          <Link href="/signup" className="text-emerald-600 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}
