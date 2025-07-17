'use client'

import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, Users, Megaphone } from 'lucide-react'
import { usePathname } from 'next/navigation'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: 'Contacts', href: '/contacts', icon: <Users className="w-5 h-5" /> },
  { name: 'Campaigns', href: '/campaigns', icon: <Megaphone className="w-5 h-5" /> },
]

export default function Sidebar() {
  const pathname = usePathname()
  const hideSidebarRoutes = ['/', '/login', '/signup']
  if (hideSidebarRoutes.includes(pathname)) return null

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-60 bg-zinc-50 border-r border-zinc-200 flex flex-col justify-between">
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

      {/* Bottom section: placeholder for future buttons (e.g., settings/logout) */}
      <div className="p-6 border-t border-zinc-200 text-sm text-zinc-500">
        {/* Future: Add settings/logout/help buttons here */}
        <p className="text-xs text-zinc-400">TextFlow © 2025</p>
      </div>
    </aside>
  )
}
