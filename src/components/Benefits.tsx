'use client'

import { CheckCircle } from 'lucide-react'

const benefits = [
  '98% open rates (vs. 20% for email)',
'Ownership of your audience. No reliance on algorithms',
  'Direct communication with your customers',
  'Higher conversion rates from promotions',
  'Collect leads and re-engage instantly',
]

export default function Benefits() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900">
          Build Your Brand with the Power of SMS
        </h2>
        <p className="mt-4 text-zinc-600 text-lg">
          SMS is one of the most effective ways to reach your audience.
        </p>

        <div className="mt-10 space-y-4 text-left max-w-xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="text-emerald-600 w-5 h-5 mt-1" />
              <p className="text-zinc-700 text-base">{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
