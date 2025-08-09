'use client'

import { useEffect, useState } from 'react'
import WelcomeMessage from '@/components/dashboard/WelcomeMessage'
import OnboardingModal from '@/components/dashboard/OnboardingModal'
import GetPhoneNumber from '@/components/dashboard/GetPhoneNumber'
import GetPhoneNumberModal from '@/components/dashboard/GetPhoneNumberModal'

export default function DashboardPage() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)
        await fetch('/api/user-profile/create', { method: 'POST' })

        const [profileRes, phoneRes] = await Promise.all([
          fetch('/api/user-profile/get'),
          fetch('/api/phone-numbers/get'),
        ])

        const profileData = await profileRes.json()
        const phoneData = await phoneRes.json()

        if (profileRes.ok && profileData.profile?.onboarding_complete === false) {
          setShowOnboarding(true)
        }

        if (phoneRes.ok) {
          setPhoneNumber(phoneData.phoneNumber || null)
        }
      } catch (_) {} finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  return (
    <main className="ml-60 flex min-h-screen items-start mt-2 justify-center bg-zinc-50 px-4 text-zinc-800">
      <div className="flex flex-col items-center text-center space-y-8 max-w-3xl w-full">
        <WelcomeMessage />
        <OnboardingModal open={showOnboarding} onClose={() => setShowOnboarding(false)} />

        {loading ? (
          <div className="w-full text-left mt-2">
            <div className="h-4 w-56 bg-zinc-200 rounded animate-pulse" />
          </div>
        ) : phoneNumber?.number ? (
          <p className="w-full text-left text-sm text-zinc-700 mt-2">
            Your Business Number: {phoneNumber.number}
          </p>
        ) : (
          <>
            <GetPhoneNumber onOpenModal={() => setShowPhoneModal(true)} />
            <GetPhoneNumberModal open={showPhoneModal} onClose={() => setShowPhoneModal(false)} />
          </>
        )}
      </div>
    </main>
  )
}
