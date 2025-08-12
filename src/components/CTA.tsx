'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Rocket, Users, TrendingUp } from 'lucide-react'

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-20 rounded-none">
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-5xl mx-auto space-y-10">
        {/* Headline */}
        <h2 className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-4xl md:text-5xl font-bold leading-tight tracking-tighter text-transparent">
          Start Driving More Sales Today
        </h2>

        {/* Subheading */}
        <p className="text-zinc-600 text-lg max-w-2xl mx-auto">
          Get your first SMS campaign live in minutes. Engage customers, boost conversions, and grow your brand.
        </p>

        {/* Benefits Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl w-full">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
              <Rocket className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900">Launch in Minutes</h3>
            <p className="text-sm text-zinc-600">
              Easy onboarding and pre-built templates mean you can start sending today.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
              <Users className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900">Grow Your List</h3>
            <p className="text-sm text-zinc-600">
              Capture and segment subscribers effortlessly to maximize engagement.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900">Boost Conversions</h3>
            <p className="text-sm text-zinc-600">
              Send high-converting promotions at the perfect time to drive results.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <Link href="/signup">
          <Button
            size="lg"
            className="mt-4 text-base font-semibold px-8 py-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer"
          >
            Get Started Free
          </Button>
        </Link>
      </div>
    </section>
  )
}
