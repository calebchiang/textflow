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

  return (
    <aside className="w-60 h-screen bg-zinc-50 px-4 py-6 flex flex-col">
      <div className="mb-10 flex justify-center">
        <Link href="/">
          <Image
            src="/logo_2.png"
            alt="Textflow Logo"
            width={60}
            height={60}
            className="rounded-lg"
          />
        </Link>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map(({ name, href, icon }) => {
          const isActive = pathname === href

          return (
            <Link
              key={name}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              {icon}
              {name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
