'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Megaphone,
  MessageCircle,
  LogOut,
  Settings,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: 'Inbox', href: '/inbox', icon: <MessageCircle className="w-5 h-5" /> },
  { name: 'Contacts', href: '/contacts', icon: <Users className="w-5 h-5" /> },
  { name: 'Campaigns', href: '/campaigns', icon: <Megaphone className="w-5 h-5" /> },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  // Hide on specific routes and any route under /help
  const shouldHide =
    ['/', '/login', '/signup'].includes(pathname) || pathname.startsWith('/help')

  if (shouldHide) return null

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-60 bg-zinc-50 border-r border-zinc-200 flex flex-col">
      <div className="p-6">
        <div className="flex justify-center mb-6">
          <Link href="/">
            <Image
              src="/logo_4.png"
              alt="Textflow Logo"
              width={60}
              height={60}
              className="rounded-lg"
            />
          </Link>
        </div>

        <nav className="space-y-2">
          {navItems.map(({ name, href, icon }) => (
            <Link
              key={name}
              href={href}
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition ${
                isActive(href)
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              {icon}
              {name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto px-6">
        <div className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 bg-white px-3 py-2 shadow-sm">
          <Link
            href="/settings"
            className="flex items-center gap-2 text-zinc-700 hover:text-zinc-900 text-sm transition"
          >
            <Settings className="w-4 h-4" />
            <span className="font-medium">Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Logout</span>
          </button>
        </div>

        <div className="mt-4 border-t border-zinc-200 py-4 text-sm text-zinc-500">
          <p className="text-xs text-zinc-400">TextFlow © 2025</p>
        </div>
      </div>
    </aside>
  )
}
