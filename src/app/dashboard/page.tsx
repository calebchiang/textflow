'use client'

import { useEffect, useState } from 'react'
import WelcomeMessage from '@/components/dashboard/WelcomeMessage'
import OnboardingModal from '@/components/dashboard/OnboardingModal'
import GetPhoneNumber from '@/components/dashboard/GetPhoneNumber'
import GetPhoneNumberModal from '@/components/dashboard/GetPhoneNumberModal'

export default function DashboardPage() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showPhoneModal, setShowPhoneModal] = useState(false)

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
    <main className="ml-60 flex min-h-screen items-start mt-2 justify-center bg-zinc-50 px-4 text-zinc-800">
      <div className="flex flex-col items-center text-center space-y-8 max-w-3xl w-full">
        <WelcomeMessage />
        <OnboardingModal open={showOnboarding} onClose={() => setShowOnboarding(false)} />
        <GetPhoneNumber onOpenModal={() => setShowPhoneModal(true)} />
        <GetPhoneNumberModal open={showPhoneModal} onClose={() => setShowPhoneModal(false)} />
      </div>
    </main>
  )
}
