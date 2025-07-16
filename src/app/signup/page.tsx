'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
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

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      router.push('/login?verify=true')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-emerald-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-zinc-800 mb-6 text-center">Create your TextFlow account</h1>

        <button className="w-full flex items-center justify-center gap-3 border border-zinc-300 rounded-md py-2 mb-6 hover:bg-zinc-100 transition">
          <Image src="/logos/google.svg" alt="Google" width={20} height={20} />
          <span className="text-sm font-medium text-zinc-800">Sign up with Google</span>
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200"></div>
          </div>
          <div className="relative text-center">
            <span className="bg-white px-2 text-xs text-zinc-400">or sign up with email</span>
          </div>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
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
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        {error && <p className="text-sm text-red-500 mt-4 text-center">{error}</p>}

        <p className="text-sm text-zinc-600 mt-4 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-emerald-600 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  )
}
