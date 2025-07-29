'use client'

import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { X } from 'lucide-react'

export default function Footer() {
  const pathname = usePathname()
  if (pathname !== '/') return null

  return (
    <footer className="w-full bg-zinc-50 border-t border-zinc-200 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-start gap-3 text-zinc-800">
          <Image
            src="/logo_4.png"
            alt="TextFlow Logo"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <div>
            <p className="font-semibold text-lg">TextFlow</p>
            <p className="text-sm text-zinc-500 max-w-xs">
              Build your SMS list and send campaigns that convert.
            </p>
            <p className="text-xs mt-2 text-zinc-400">© 2025 TextFlow.</p>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3">
          <p className="text-sm font-medium text-zinc-500">Social Links:</p>
          <div className="flex gap-3">
            <Link
              href="https://x.com/CalebChiang_"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-100 hover:bg-zinc-200 p-2 rounded-full transition"
            >
              <X className="w-5 h-5 text-zinc-600" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
