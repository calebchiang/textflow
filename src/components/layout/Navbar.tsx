'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  // 🧠 Hide navbar on /login and /signup
  const hideNavbarRoutes = ['/login', '/signup', '/dashboard']
  if (hideNavbarRoutes.includes(pathname)) return null

  return (
    <header className="w-full bg-zinc-50 border-b border-zinc-200 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image
              src="/logo_2.png"
              alt="Textflow Logo"
              width={40}
              height={40}
              className="rounded-md"
            />
          </Link>
          <span className="text-lg font-bold text-zinc-800">TextFlow</span>
        </div>

        <nav className="flex items-center gap-6 text-sm font-medium text-zinc-700">
          <Link
            href="/login"
            className="hover:text-emerald-600 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
          >
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  )
}
