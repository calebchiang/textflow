'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'

const ComplianceEmbed = dynamic(
  () =>
    import('@twilio/twilio-compliance-embed').then(
      (m) => m.TwilioComplianceEmbed
    ),
  { ssr: false }
)

export default function VerifyNumberPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{
    inquiry_id: string
    inquiry_session_token: string
    registration_id?: string
    phone_number?: string
  } | null>(null)

  const handleStart = async () => {
    setError(null)
    setResult(null)

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('/api/tfv/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_email: email }),
      })

      const json = await res.json()
      if (!res.ok) {
        throw new Error(json?.error || 'Failed to initialize verification')
      }

      setResult(json)
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="ml-60 flex min-h-screen flex-col bg-zinc-50 px-6 py-10 text-zinc-800">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-semibold">Verify Toll-Free Number</h1>

        {!result && (
          <>
            <p className="mt-2 text-sm text-zinc-600">
              Enter the email that should receive verification updates.
            </p>

            <div className="mt-6 space-y-2">
              <label htmlFor="notify-email" className="text-sm font-medium text-zinc-700">
                Notification Email
              </label>
              <input
                id="notify-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none ring-0 focus:border-zinc-300"
              />
              <p className="text-xs text-zinc-500">
                We’ll send verification status updates here.
              </p>
            </div>

            <div className="mt-6">
              <Button
                className="w-full sm:w-auto"
                disabled={loading}
                onClick={handleStart}
              >
                {loading ? 'Starting…' : 'Start Verification'}
              </Button>
            </div>

            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </>
        )}

        {result && (
          <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4">
            <div className="h-[70vh] w-full">
              <ComplianceEmbed
                inquiryId={result.inquiry_id}
                inquirySessionToken={result.inquiry_session_token}
                onReady={() => {}}
                onInquirySubmitted={() => {}}
                onComplete={() => {}}
                onCancel={() => setResult(null)}
                onError={() => {}}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
