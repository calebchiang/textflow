'use client'

import { useEffect, useState } from 'react'
import WelcomeMessage from '@/components/dashboard/WelcomeMessage'
import OnboardingModal from '@/components/dashboard/OnboardingModal'

export default function DashboardPage() {
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    const initUserProfile = async () => {
      try {
        await fetch('/api/user-profile/create', { method: 'POST' })
        const res = await fetch('/api/user-profile/get')
        const data = await res.json()

        if (res.ok && data.profile?.onboarding_complete === false) {
          setShowOnboarding(true)
        }
      } catch (_) {
      }
    }

    initUserProfile()
  }, [])

  return (
    <main className="ml-60 flex min-h-screen flex-col items-start justify-start bg-zinc-50 px-4 text-zinc-800">
      <WelcomeMessage />
      <OnboardingModal open={showOnboarding} onClose={() => setShowOnboarding(false)} />
    </main>
  )
}
