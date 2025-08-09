'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Pricing() {
  const [country, setCountry] = useState('canada')
  const [volume, setVolume] = useState(100)

  const smsPrice = 0.05

  const totalCost = (volume * smsPrice).toFixed(2)

  const volumes = [100, 500, 1000, 2000, 5000, 10000]

  return (
    <section id="pricing" className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold text-zinc-900">
          Pay only for what you use.
        </h2>
        <p className="mt-3 text-zinc-600 text-lg">
          No subscriptions. No hidden fees. Just simple, pay-per-message pricing.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 border rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h3 className="text-2xl font-bold mb-6">Send SMS</h3>

          <div className="mb-6">
            <label className="block text-sm font-medium text-zinc-600 mb-2">Select your destination country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full border border-zinc-300 rounded-md p-2"
            >
              <option value="canada">Canada</option>
              <option value="us" disabled>
                United States (Coming Soon)
              </option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-zinc-600 mb-2">Select your SMS volume</label>
            <select
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full border border-zinc-300 rounded-md p-2"
            >
              {volumes.map((v) => (
                <option key={v} value={v}>
                  {v.toLocaleString()} SMS
                </option>
              ))}
            </select>
          </div>

          <p className="text-zinc-500 text-sm">
            1 SMS is 160 standard characters or 70 Unicode characters.
          </p>
        </div>

        <div className="bg-zinc-50 p-8 flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-semibold text-zinc-700 mb-2">Estimated cost:</h4>
            <p className="text-4xl font-bold text-zinc-900 mb-6">${totalCost} CAD</p>

            <div className="space-y-2 text-sm text-zinc-600">
              <p>{volume.toLocaleString()} SMS @ 5¢ per SMS</p>
              <p>$4.99/month for a 10DLC business number</p>
              <p>No monthly subscriptions</p>
            </div>
          </div>

          <Link href="/signup">
            <button className="mt-8 bg-emerald-600 text-white py-3 rounded-md hover:bg-emerald-700 transition w-full">
              Start for Free
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
