'use client'

import Link from 'next/link'
import {
  Phone,
  ShieldCheck,
  BadgeCheck,
  Clock,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'

export default function TollFreeNumber() {
  return (
    <section className="relative bg-zinc-50 py-20 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70 blur-3xl"
        style={{
          background: `
            radial-gradient(600px 300px at 15% 20%, rgba(99, 102, 241, .12), transparent 60%),
            radial-gradient(600px 300px at 85% 80%, rgba(16, 185, 129, .14), transparent 60%)
          `,
        }}
      />

      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10 flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-emerald-600" />
          <span className="text-sm font-semibold tracking-wide text-emerald-700 uppercase">
            Secure Toll-Free Numbers
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-zinc-200 p-8">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-3xl font-bold text-zinc-900">
                Purchase a verified toll-free number
              </h2>

              <div className="shrink-0">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-center">
                  <div className="text-xs text-zinc-500 line-through">$8.99</div>
                  <div className="text-xl font-extrabold text-emerald-700">$4.99</div>
                  <div className="text-[11px] font-medium text-emerald-700">/month</div>
                </div>
                <div className="mt-1 text-[11px] text-emerald-700 text-center">Early-bird special</div>
              </div>
            </div>

            <p className="mt-4 text-zinc-600">
              Get a trusted, carrier-approved toll-free number for better deliverability and brand
              credibility. 
            </p>

            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <li className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-medium text-zinc-900">Verified & trusted</p>
                  <p className="text-sm text-zinc-600">
                    Numbers are verified for compliant A2P messaging.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <BadgeCheck className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-medium text-zinc-900">Higher deliverability</p>
                  <p className="text-sm text-zinc-600">
                    Reduce filtering and build long-term sender reputation.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-medium text-zinc-900">Brand-friendly</p>
                  <p className="text-sm text-zinc-600">
                    One recognizable number for promotions & support.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-medium text-zinc-900">Compliance built-in</p>
                  <p className="text-sm text-zinc-600">
                    Consent capture and opt-out handling out of the box.
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/signup?plan=tollfree"
                className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2.5 text-white font-medium hover:bg-emerald-700 transition"
              >
                Get a toll-free number
              </Link>
              <Link
                href="/#pricing"
                className="inline-flex items-center justify-center rounded-md border border-emerald-200 bg-white px-4 py-2.5 text-emerald-700 font-medium hover:bg-emerald-50 transition"
              >
                See pricing details
              </Link>
            </div>

            <p className="mt-4 text-xs text-zinc-500">
              $4.99/mo maintains your verified toll-free number (regular $8.99). Messaging usage is billed
              separately at your pay-per-message rate.
            </p>
          </div>

          <aside className="lg:col-span-2">
            <div className="h-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col">
              <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-zinc-50 border border-emerald-100 p-5">
                <div className="flex items-center gap-2 text-emerald-700">
                  <ShieldCheck className="h-5 w-5" />
                  <p className="text-sm font-semibold">Why toll-free?</p>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Consistent brand identity across campaigns and support.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Great for higher volumes and nationwide reach.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Strong deliverability with carrier-approved messaging.
                  </li>
                </ul>
              </div>

              <div className="mt-6 rounded-xl bg-zinc-50 border border-zinc-200 p-5">
                <h3 className="text-sm font-semibold text-zinc-700 uppercase tracking-wide">
                  How it works
                </h3>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Step
                    icon={<Phone className="h-4 w-4" />}
                    title="Pick your number"
                    desc="Choose a toll-free you like or let us auto-assign."
                  />
                  <Step
                    icon={<ShieldCheck className="h-4 w-4" />}
                    title="5-minute verification"
                    desc="Fill a short form about your brand & use case."
                  />
                  <Step
                    icon={<Clock className="h-4 w-4" />}
                    title="Carrier review"
                    desc="We submit to carriers for quick approval."
                  />
                  <Step
                    icon={<CheckCircle2 className="h-4 w-4" />}
                    title="Start sending"
                    desc="Go live in ~2 days and begin messaging."
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

function Step({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3">
      <div className="flex items-center gap-2 text-zinc-800">
        <div className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
          {icon}
        </div>
        <p className="font-semibold text-[15px] leading-tight">{title}</p>
      </div>
      <p className="mt-1.5 text-sm text-zinc-600 leading-snug">{desc}</p>
    </div>
  )
}
