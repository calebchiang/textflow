'use client'

import { Quote, Star } from 'lucide-react'

type Testimonial = {
  quote: string
  name: string
  title: string
  location: string
}

const testimonials: Testimonial[] = [
  {
    quote:
      "We spun up our first SMS campaign in under 10 minutes. Replies came in fast, and we booked five demos the same day.",
    name: 'Maya Chen',
    title: 'Founder',
    location: 'Vancouver, Canada',
  },
  {
    quote:
      "Switching from monthly plans to pay-per-message cut our costs by ~40%. The shared inbox keeps our team on the same page.",
    name: 'Ethan Brooks',
    title: 'Operations Manager',
    location: 'Seattle, USA',
  },
  {
    quote:
      "List growth finally clicked. Zero spam complaints so far.",
    name: 'Ava Martinez',
    title: 'Business Owner',
    location: 'Toronto, Canada',
  },
  {
    quote:
      "We caught the best send window for our audience and lifted CTR by 22%.",
    name: 'Liam Carter',
    title: 'Marketing Director',
    location: 'Denver, USA',
  },
  {
    quote:
      "Verification for our toll-free number was smooth. Deliverability’s been rock-solid since.",
    name: 'Noah Patel',
    title: 'Clinic Owner',
    location: 'Burnaby, Canada',
  },
  {
    quote:
      "The UI is clean, fast, and obvious. My team didn’t need a training call.",
    name: 'Sophia Nguyen',
    title: 'Head of Growth',
    location: 'Austin, USA',
  },
]

function InitialsAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold">
      {initials}
    </div>
  )
}

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-emerald-500 text-emerald-500" />
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="relative bg-white py-20 px-6">
      <div id="testimonials" className="max-w-6xl mx-auto">
        <div className="mb-10 flex items-center gap-3">
          <Quote className="h-5 w-5 text-emerald-600" />
          <span className="text-sm font-semibold tracking-wide text-emerald-700 uppercase">
            What customers say
          </span>
        </div>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-zinc-900">
            Proof it works in the real world
          </h2>
          <p className="mt-2 text-zinc-600">
            Clean, reliable SMS that decision-makers actually adopt.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <article
              key={idx}
              className="group relative overflow-hidden rounded-2xl bg-white border border-zinc-200 shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <Quote className="h-5 w-5 text-emerald-600" />
                <Stars />
              </div>

              <p className="mt-4 text-zinc-800 leading-relaxed">
                “{t.quote}”
              </p>

              <div className="mt-6 flex items-center gap-3">
                <InitialsAvatar name={t.name} />
                <div className="min-w-0">
                  <p className="font-semibold text-zinc-900">{t.name}</p>
                  <p className="text-sm text-zinc-600 truncate">
                    {t.title} 
                  </p>
                  <p className="text-xs text-zinc-500">{t.location}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
