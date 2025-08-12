'use client'

import { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CreditCard, MessageSquareText } from 'lucide-react'

interface GetCreditsModalProps {
  open: boolean
  onClose: () => void
}

export default function GetCreditsModal({ open, onClose }: GetCreditsModalProps) {
  const [volume, setVolume] = useState<number>(500)
  const [loading, setLoading] = useState(false)

  // Flat pricing
  const smsPrice = 0.05
  const volumes = [100, 500, 1000, 2000, 5000, 10000]

  const totalCost = useMemo(() => (volume * smsPrice).toFixed(2), [volume])

  const handleBuyCredits = async () => {
    try {
      setLoading(true)
      // NOTE: if your route is not under /api, change the path accordingly (e.g. '/checkout/credits')
      const res = await fetch('/api/checkout/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volume }), // you can also send plan: `sms_${volume}` if you want
      })

      const data = await res.json()
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || 'Failed to create checkout session')
      }

      window.location.href = data.url
    } catch (err) {
      console.error('Buy credits error:', err)
      alert('There was an issue starting checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-zinc-200 bg-white">
              <MessageSquareText className="h-4 w-4 text-zinc-700" />
            </span>
            Get Credits
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-sm text-zinc-600">
            Pay only for what you use. No subscriptions.
          </p>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700">
              SMS volume
            </label>
            <select
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              disabled={loading}
              className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm disabled:opacity-60"
            >
              {volumes.map((v) => (
                <option key={v} value={v}>
                  {v.toLocaleString()} SMS
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-end justify-between">
              <div>
                <h4 className="text-sm font-semibold text-zinc-800">Cost</h4>
                <p className="mt-1 text-3xl font-bold text-zinc-900">${totalCost}</p>
              </div>
              <div className="text-right text-xs text-zinc-600">
                <p>{volume.toLocaleString()} SMS @ 5¢ per SMS</p>
              </div>
            </div>

            <p className="mt-3 text-xs text-zinc-500">
              1 SMS = 160 standard characters or 70 Unicode characters.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60"
              onClick={handleBuyCredits}
              disabled={loading}
              aria-label="Buy credits"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {loading ? 'Redirecting…' : 'Buy Credits'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
