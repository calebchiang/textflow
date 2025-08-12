'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Phone, ShieldCheck, XCircle } from 'lucide-react'

type PhoneNumberRow = {
  id: string
  number: string
  twilio_phone_sid: string
  country: string
  created_at: string
  status?: 'unverified' | 'verified'
}

type Props = {
  phoneLoading: boolean
  phoneError: string | null
  phoneNumber: PhoneNumberRow | null
  prettyNumber: string | null
}

export default function TollFreeNumberSettings({
  phoneLoading,
  phoneError,
  phoneNumber,
  prettyNumber,
}: Props) {
  const router = useRouter()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  const statusBadge = (status?: PhoneNumberRow['status']) => {
    const map: Record<string, string> = {
      unverified: 'bg-amber-100 text-amber-800 border-amber-200',
      verified: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    }
    return (
      <span
        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${
          map[status || 'unverified'] || 'bg-zinc-100 text-zinc-700 border-zinc-200'
        }`}
      >
        {status ?? 'unverified'}
      </span>
    )
  }

  const handleConfirmCancel = async () => {
    try {
      setIsCancelling(true)
      const res = await fetch('/api/cancel/cancel-phone-number', { method: 'POST' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Failed to cancel number')
      }
      setConfirmOpen(false)
      // Reload so parent refetches and UI reflects deletion
      window.location.reload()
    } catch (err) {
      console.error(err)
      setIsCancelling(false)
      alert('Cancellation failed. Please try again.')
    }
  }

  return (
    <section>
      <h2 className="text-lg font-semibold">Toll-Free Number</h2>

      {phoneLoading ? (
        <div className="mt-2 rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="h-6 w-40 rounded bg-zinc-200 animate-pulse" />
          <div className="mt-2 h-4 w-24 rounded bg-zinc-200 animate-pulse" />
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div className="h-9 rounded bg-zinc-200 animate-pulse" />
            <div className="h-9 rounded bg-zinc-200 animate-pulse" />
            <div className="h-9 rounded bg-zinc-200 animate-pulse" />
          </div>
        </div>
      ) : phoneError ? (
        <Card className="mt-2 border-rose-200">
          <CardHeader>
            <div className="text-sm text-rose-700">Couldn’t load your number. Try again from the dashboard.</div>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      ) : phoneNumber?.number ? (
        <Card className="mt-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-zinc-100 p-2">
                  <Phone className="h-5 w-5 text-zinc-700" />
                </div>
                <div>
                  <div className="text-sm text-zinc-500">Your Toll-Free Number</div>
                  <div className="text-xl font-semibold tracking-tight">{prettyNumber}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">{statusBadge(phoneNumber.status)}</div>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-zinc-600">
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              <div className="text-xs text-zinc-500">Created</div>
              <div className="font-medium">
                {phoneNumber.created_at
                  ? new Date(phoneNumber.created_at).toLocaleDateString()
                  : '—'}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            {phoneNumber.status !== 'verified' && (
              <Button onClick={() => router.push('/numbers/verify')}>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Verify / Compliance
              </Button>
            )}

            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Number
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel this number?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel this number? You will lose all access to sending and receiving messages from this number.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isCancelling}>Keep Number</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleConfirmCancel}
                    disabled={isCancelling}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isCancelling ? 'Cancelling…' : 'Yes, Cancel'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ) : (
        <Card className="mt-2">
          <CardHeader>
            <div className="text-base font-medium text-zinc-800">No toll-free number yet</div>
          </CardHeader>
          <CardContent className="text-sm text-zinc-600">
            Purchase a toll-free number to start sending and receiving messages.
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/dashboard')}>
              Get a Toll-Free Number
            </Button>
          </CardFooter>
        </Card>
      )}
    </section>
  )
}
