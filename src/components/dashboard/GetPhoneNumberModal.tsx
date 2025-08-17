'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Search, CheckCircle } from 'lucide-react'
import clsx from 'clsx'

interface GetPhoneNumberModalProps {
  open: boolean
  onClose: () => void
}

interface AvailableNumber {
  phoneNumber: string
  friendlyName: string
}

export default function GetPhoneNumberModal({ open, onClose }: GetPhoneNumberModalProps) {
  const [step, setStep] = useState(1)
  const [availableNumbers, setAvailableNumbers] = useState<AvailableNumber[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null)
  const [noResults, setNoResults] = useState(false)

  useEffect(() => {
    if (!open) {
      setStep(1)
      setAvailableNumbers([])
      setSelectedNumber(null)
      setLoading(false)
      setNoResults(false)
    }
  }, [open])

  const handleSearch = async () => {
    setLoading(true)
    setNoResults(false)

    const res = await fetch('/api/twilio/get-phone-numbers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}), // Toll-Free search doesn't need params
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      if (data.numbers.length === 0) {
        setNoResults(true)
      } else {
        setAvailableNumbers(data.numbers)
        setStep(2)
      }
    } else {
      console.error(data.error)
    }
  }

  const handleNext = () => {
    if (selectedNumber) setStep(3)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Get a Phone Number</DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="grid gap-4 py-2 text-sm text-zinc-600">
            <p>
              This is where you'll choose the phone number you'll send SMS messages from.
              We provide <span className="font-medium">North American Toll-Free</span> numbers that work in the US and Canada.
            </p>

            <Button
              className="w-full gap-2"
              disabled={loading}
              onClick={handleSearch}
            >
              <Search className="w-4 h-4" />
              {loading ? 'Searching...' : 'Search Available Numbers'}
            </Button>

            {noResults && (
              <p className="text-red-500 text-sm">
                No available phone numbers found.
              </p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 py-2">
            <p className="text-sm text-zinc-600">
              Select a Toll-Free number from the list below. All numbers are SMS-enabled and unique to you.
            </p>

            <div className="max-h-60 overflow-y-auto border rounded-md">
              {availableNumbers.map((num) => (
                <button
                  key={num.phoneNumber}
                  className={clsx(
                    'w-full text-left px-4 py-2 border-b last:border-b-0 hover:bg-zinc-100 text-sm flex items-center justify-between',
                    selectedNumber === num.phoneNumber && 'bg-emerald-50'
                  )}
                  onClick={() => setSelectedNumber(num.phoneNumber)}
                >
                  <span>{num.friendlyName || num.phoneNumber}</span>
                  {selectedNumber === num.phoneNumber && (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  )}
                </button>
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={!selectedNumber}
              className="w-full"
            >
              Next
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-4 py-2 text-sm text-zinc-600">
            <p>You selected:</p>
            <div className="text-lg font-semibold text-zinc-800">
              {selectedNumber}
            </div>

            <div className="text-sm text-zinc-600 mt-1">
              This Toll-Free number will be yours exclusively and used to send and receive SMS messages from your dashboard.
            </div>

            <div className="mt-4 p-3 bg-zinc-100 rounded-md text-sm text-zinc-700">
              <div className="text-xs text-zinc-500 mb-1">Price</div>
              <div className="text-2xl font-bold text-zinc-800">$4.99/month</div>
            </div>

            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={async () => {
                if (!selectedNumber) return
                try {
                  const res = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ selectedNumber }),
                  })

                  const data = await res.json()
                  if (res.ok && data.url) {
                    window.location.href = data.url
                  } else {
                    console.error('Checkout session error:', data.error)
                    alert('Something went wrong creating the payment session.')
                  }
                } catch (err) {
                  console.error('Checkout error:', err)
                  alert('Payment failed to start.')
                }
              }}
            >
              Continue to Payment
            </Button>
          </div>
        )}

        <DialogFooter className="mt-4 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="text-sm text-blue-600 hover:underline"
            >
              Back
            </button>
          ) : <div />}

          <DialogClose asChild>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
