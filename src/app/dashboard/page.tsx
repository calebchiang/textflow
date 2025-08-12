'use client'

import { useEffect, useState } from 'react'
import WelcomeMessage from '@/components/dashboard/WelcomeMessage'
import GetPhoneNumber from '@/components/dashboard/GetPhoneNumber'
import GetPhoneNumberModal from '@/components/dashboard/GetPhoneNumberModal'
import PhoneNumberInfo from '@/components/dashboard/PhoneNumberInfo'

type PhoneNumberRow = {
  number: string
  status?: string // 'unverified' | 'in_review' | 'approved' | 'rejected'
}

export default function DashboardPage() {
  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState<PhoneNumberRow | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/phone-numbers/get')
        const data = await res.json()
        if (res.ok) {
          setPhoneNumber(data.phoneNumber || null)
        }
      } catch (_) {
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  return (
    <main className="ml-60 flex min-h-screen items-start mt-2 justify-center bg-zinc-50 px-4 text-zinc-800 pt-14">
      <div className="flex flex-col items-center text-center space-y-8 max-w-3xl w-full">
        <WelcomeMessage />

        {loading ? (
          <div className="w-full text-left mt-2">
            <div className="h-4 w-56 bg-zinc-200 rounded animate-pulse" />
          </div>
        ) : phoneNumber?.number ? (
          <div className="w-full text-left mt-2 space-y-3">
            <PhoneNumberInfo
              number={phoneNumber.number}
              status={phoneNumber.status as any}
              onVerify={() => {
                window.location.href = '/numbers/verify'
              }}
            />
          </div>
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
