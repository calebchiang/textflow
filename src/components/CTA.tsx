'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function CTA() {
  return (
    <section className="py-20 px-6 bg-zinc-50">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900">
          Start Driving More Sales Today
        </h2>
        <p className="text-zinc-600 text-lg max-w-2xl mx-auto">
          Launch your first SMS campaign in minutes. No marketing experience needed.
        </p>

        <Link href="/signup">
          <Button
            size="lg"
            className="text-base font-semibold px-8 py-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer"
          >
            Get Started
          </Button>
        </Link>
      </div>
    </section>
  )
}
