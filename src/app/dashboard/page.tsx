'use client'

import WelcomeMessage from '@/components/dashboard/WelcomeMessage'

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-start justify-start bg-zinc-50 px-4 text-zinc-800">
      <WelcomeMessage />
    </main>
  )
}
