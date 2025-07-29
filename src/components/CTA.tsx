'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { RetroGrid } from '@/components/magicui/retro-grid'

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-zinc-50 px-6 py-16 rounded-none">
      <RetroGrid
        className="absolute inset-0 z-0"
        angle={65}
        cellSize={60}
        opacity={0.9}
        lightLineColor="#d4d4d8" 
        darkLineColor="#d4d4d8"
      />

      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-4xl mx-auto space-y-8">
        <h2 className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-4xl md:text-5xl font-bold leading-tight tracking-tighter text-transparent">
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
