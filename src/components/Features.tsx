'use client'

import Image from 'next/image'
import {
  Contact,
  Tags,
  ShieldCheck,
  Inbox,
  User,
  Smartphone,
  Megaphone,
  Clock,
  BarChart3,
} from 'lucide-react'

export default function Features() {
  const features = [
    {
      id: 1,
      title: 'Build Your SMS List',
      description:
        'Capture phone numbers through popups, QR codes, and signup forms. Turn casual visitors into subscribers and grow your audience on autopilot.',
      bullets: [
        {
          label: 'Multiple Opt-in Methods',
          desc: 'Forms, QR codes, and more to match your marketing flow.',
          icon: Contact,
        },
        {
          label: 'Automatic Tagging',
          desc: 'Segment subscribers at signup for better targeting.',
          icon: Tags,
        },
        {
          label: 'Compliance Built-In',
          desc: 'Stay TCPA compliant with automatic consent collection.',
          icon: ShieldCheck,
        },
      ],
      image: '/opt_in.png',
      reversed: false,
    },
    {
      id: 2,
      title: 'Two-Way Conversations',
      description:
        'Chat with leads, answer questions, and close sales — all from one shared inbox. Give your customers the fast, personal responses they expect.',
      bullets: [
        {
          label: 'Unified Inbox',
          desc: 'See all conversations in one clean dashboard.',
          icon: Inbox,
        },
        {
          label: 'Customer Profiles',
          desc: 'View message history and context at a glance.',
          icon: User,
        },
        {
          label: 'Mobile Friendly',
          desc: 'Reply on the go from any device.',
          icon: Smartphone,
        },
      ],
      image: '/two_way.png',
      reversed: true,
    },
    {
      id: 3,
      title: 'Send Bulk Promotions',
      description:
        'Send high-converting campaigns in seconds. Use pre-built templates or schedule custom broadcasts to drive sales and traffic.',
      bullets: [
        {
          label: 'Campaign Templates',
          desc: 'Pick from proven layouts that convert.',
          icon: Megaphone,
        },
        {
          label: 'Smart Scheduling',
          desc: 'Send at the optimal time based on customer behavior.',
          icon: Clock,
        },
        {
          label: 'Analytics',
          desc: 'Track open rates, clicks, and replies in real-time.',
          icon: BarChart3,
        },
      ],
      image: '/promotion.png',
      reversed: false,
    },
  ]

  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto space-y-32">
        {features.map((feature) => (
          <div
            key={feature.id}
            className={`flex flex-col-reverse md:flex-row ${
              feature.reversed ? 'md:flex-row-reverse' : ''
            } items-center gap-12`}
          >
            <div className="w-full md:w-1/2">
              <Image
                src={feature.image}
                alt={feature.title}
                width={1000}
                height={1000}
                className="w-full h-auto"
              />
            </div>

            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold text-zinc-900 mb-4">
                {feature.title}
              </h2>
              <p className="text-zinc-600 mb-6">{feature.description}</p>
              <ul className="space-y-4">
                {feature.bullets.map((b, idx) => {
                  const Icon = b.icon
                  return (
                    <li key={idx} className="flex items-start gap-4">
                      <Icon className="w-5 h-5 text-emerald-600 mt-1" />
                      <div>
                        <p className="font-semibold text-zinc-800">{b.label}</p>
                        <p className="text-zinc-500 text-sm">{b.desc}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
