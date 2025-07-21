'use client'

import { Rocket, Bot, MessageSquare, Users } from 'lucide-react'
import { BentoGrid, BentoCard } from '@/components/magicui/bento-grid'

const features = [
  {
    Icon: Rocket,
    name: 'Campaign Blasts',
    description: 'Send promotional messages to your entire list with one click.',
    className: 'col-span-3 lg:col-span-2', 
  },
  {
    Icon: Bot,
    name: 'Automated Flows',
    description: 'Set up drip sequences, welcome texts, and follow-ups on autopilot.',
    className: 'col-span-3 lg:col-span-1', 
  },
  {
    Icon: MessageSquare,
    name: 'Two-Way Chat',
    description: 'Talk with leads and customers in a single, unified inbox.',
    className: 'col-span-3 lg:col-span-2',
  },
  {
    Icon: Users,
    name: 'Audience Segmentation',
    description: 'Organize contacts by tags and behavior for smarter targeting.',
    className: 'col-span-3 lg:col-span-1',
  },
]

export default function Features() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-zinc-900 text-center mb-10">
          Powerful Features Built for Growth
        </h2>

       <BentoGrid>
        {features.map((feature, index) => (
            <BentoCard
              key={index}
              name={feature.name}
              description={feature.description}
              Icon={feature.Icon}
              cta="Learn More"
              className={feature.className}
              background="bg-emerald-100"
              href="#"
            />
        ))}
        </BentoGrid>
      </div>
    </section>
  )
}
