'use client'

import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function VerifyNumberPage() {
  const benefits = [
    "Send messages without delivery restrictions",
    "Improve trust and deliverability with carriers",
    "Comply with toll-free messaging regulations",
  ]

  return (
    <main className="ml-60 flex min-h-screen flex-col items-start justify-start bg-zinc-50 px-4 text-zinc-800">
      <h1 className="mt-6 text-2xl font-semibold">Verify Toll-Free Number</h1>

      <ul className="mt-4 space-y-3">
        {benefits.map((benefit, idx) => (
          <li key={idx} className="flex items-start gap-2 text-zinc-700">
            <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            {benefit}
          </li>
        ))}
      </ul>

      <Button 
        className="mt-6"
        onClick={() => {
          console.log("Start verification flow")
        }}
      >
        Start Verification
      </Button>
    </main>
  )
}
