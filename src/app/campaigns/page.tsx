'use client'

import { useState } from 'react'

export default function CampaignsPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSendSMS = async () => {
    setLoading(true)
    setSuccess(null)
    setError(null)

    try {
      const res = await fetch('/api/twilio/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: '+17788231022', 
          message: 'Test SMS from TextFlow!',
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send SMS')

      setSuccess(`Message sent!`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="ml-60 flex min-h-screen flex-col items-start justify-start bg-zinc-50 px-4 text-zinc-800">
      <h1 className="mt-6 text-2xl font-semibold">Campaigns</h1>
      <p className="mt-1 text-zinc-600">Send SMS campaigns to your audience.</p>

      <div className="mt-6 w-full">
        <button
          onClick={handleSendSMS}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Sending...' : 'Send Test SMS'}
        </button>

        {success && <p className="text-green-600 mt-4">{success}</p>}
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    </main>
  )
}
