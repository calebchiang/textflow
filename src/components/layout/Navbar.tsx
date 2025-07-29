'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const pathname = usePathname()
  const supabase = createClient()

  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const hideNavbarRoutes = ['/login', '/signup', '/dashboard', '/contacts', '/campaigns', '/inbox']
  const shouldHide = hideNavbarRoutes.includes(pathname)
  if (shouldHide) return null

  return (
    <header className="w-full bg-zinc-50 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image
              src="/logo_4.png"
              alt="Textflow Logo"
              width={40}
              height={40}
              className="rounded-md"
            />
          </Link>
          <span className="text-lg font-bold text-zinc-800">TextFlow</span>
        </div>

        <nav className="flex items-center gap-4 text-sm font-medium text-zinc-700">
          {user ? (
            <Link
              href="/dashboard"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hover:text-emerald-600 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
