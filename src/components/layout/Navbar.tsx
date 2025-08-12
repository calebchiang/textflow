'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const supabase = createClient()

  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

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

  const shouldHide =
    pathname.startsWith('/auth') ||
    pathname.startsWith('/campaigns') ||
    pathname.startsWith('/numbers') || 
    ['/login', '/signup', '/dashboard', '/contacts', '/inbox', '/settings'].includes(pathname)

  if (shouldHide) return null

  const navLinks = (
    <>
      {pathname === '/' && (
        <>
          <a href="#features" className="hover:text-emerald-600 transition-colors">
            Features
          </a>
          <a href="#testimonials" className="hover:text-emerald-600 transition-colors">
            Testimonials
          </a>
          <a href="#pricing" className="hover:text-emerald-600 transition-colors">
            Pricing
          </a>
          
        </>
      )}

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
            <span className="font-bold">Login</span>
          </Link>
          <Link
            href="/signup"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition"
          >
            Sign Up
          </Link>
        </>
      )}
    </>
  )

  return (
    <header className="sticky top-0 z-50 w-full bg-zinc-50 px-6 py-4">
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

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-700">
          {navLinks}
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-zinc-800 hover:text-emerald-600 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-[500px] pb-4' : 'max-h-0'
        }`}
      >
        <div className="flex flex-col space-y-2 pt-4 text-sm font-medium text-zinc-700">
          {navLinks}
        </div>
      </div>
    </header>
  )
}
