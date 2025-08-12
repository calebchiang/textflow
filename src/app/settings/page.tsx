'use client'

import { useEffect, useMemo, useState } from 'react'
import UserEmail from '@/components/settings/UserEmail'
import TollFreeNumberSettings from '@/components/settings/TollFreeNumberSettings'

type PhoneNumberRow = {
  id: string
  number: string
  twilio_phone_sid: string
  country: string
  created_at: string
  status?: 'unverified' | 'verified'
}

export default function SettingsPage() {
  const [email, setEmail] = useState<string | null>(null)
  const [loadingEmail, setLoadingEmail] = useState(true)

  const [phoneLoading, setPhoneLoading] = useState(true)
  const [phoneNumber, setPhoneNumber] = useState<PhoneNumberRow | null>(null)
  const [phoneError, setPhoneError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/settings/get-user-email', { cache: 'no-store' })
        const data = await res.json()
        if (res.ok) setEmail(data.email)
      } catch (_) {
      } finally {
        setLoadingEmail(false)
      }
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        setPhoneLoading(true)
        const res = await fetch('/api/phone-numbers/get', { cache: 'no-store' })
        const data = await res.json()
        if (res.ok) {
          setPhoneNumber(data.phoneNumber ?? null)
        } else {
          setPhoneError(data?.error || 'Failed to load phone number')
        }
      } catch (_) {
        setPhoneError('Failed to load phone number')
      } finally {
        setPhoneLoading(false)
      }
    })()
  }, [])

  const prettyNumber = useMemo(() => {
    if (!phoneNumber?.number) return null
    const m = phoneNumber.number.match(/^\+?(\d)(\d{3})(\d{3})(\d{4})$/)
    if (!m) return phoneNumber.number
    return `+${m[1]} (${m[2]}) ${m[3]}-${m[4]}`
  }, [phoneNumber?.number])

  return (
    <main className="ml-60 flex min-h-screen flex-col items-start justify-start bg-zinc-50 px-4 text-zinc-800">
      <h1 className="mt-6 text-2xl font-semibold">Settings</h1>
      <p className="mt-1 text-zinc-600">Manage your account.</p>

      <div className="mt-6 w-full max-w-2xl space-y-6">
        <UserEmail email={email} loading={loadingEmail} />
        <TollFreeNumberSettings
          phoneLoading={phoneLoading}
          phoneError={phoneError}
          phoneNumber={phoneNumber}
          prettyNumber={prettyNumber}
        />
      </div>
    </main>
  )
}
