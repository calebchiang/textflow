'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function HelpNavbar() {
  const pathname = usePathname()

  if (!pathname.startsWith('/help')) return null

  return (
    <header className="w-full bg-zinc-900 text-zinc-100 border-b border-zinc-800">
      <div className="max-w-6xl mx-auto flex items-center gap-4 px-6 py-6">
        <Link href="/help" className="flex items-center gap-3 group">
          <Image
            src="/logo_4.png"
            alt="Textflow Logo"
            width={48}
            height={48}
            className="rounded-md"
          />
          <span className="text-2xl font-bold tracking-tight group-hover:text-zinc-300 transition-colors">
            Help Center
          </span>
        </Link>
      </div>
    </header>
  )
}
