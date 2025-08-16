'use client'

import Link from 'next/link'

interface HeaderItem {
  id: string
  text: string
  level?: number 
}

export default function HelpSidebar({ headers }: { headers: HeaderItem[] }) {
  return (
    <aside className="hidden md:block w-50 sticky top-24 max-h-[80vh] overflow-y-auto pl-6">
      <h3 className="text-sm font-semibold text-zinc-200 mb-3">On this page</h3>
      <nav aria-label="Table of contents">
        <ul className="space-y-2 text-sm">
          {headers.map((h) => (
            <li key={h.id} className={h.level === 3 ? 'ml-4' : ''}>
              <Link
                href={`#${h.id}`}
                className="block text-zinc-300 hover:text-zinc-400 transition-colors"
              >
                {h.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
