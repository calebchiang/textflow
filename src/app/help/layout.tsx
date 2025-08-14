import type { ReactNode } from 'react'
import HelpNavbar from '@/components/layout/HelpNavbar'

export default function HelpLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh text-zinc-100">
      <div className="fixed inset-0 -z-10 bg-zinc-900" />
      <HelpNavbar />
      <div className="relative">{children}</div>
    </div>
  )
}
