'use client'

import { Megaphone, CalendarCheck, Clock, Pencil } from 'lucide-react'

interface CampaignOverviewProps {
  totalCampaigns: number
  sentAllTime: number
  scheduledCampaigns: number
  draftCampaigns: number
}

export default function CampaignOverview({
  totalCampaigns,
  sentAllTime,
  scheduledCampaigns,
  draftCampaigns
}: CampaignOverviewProps) {
  const cards = [
    {
      label: 'All Campaigns',
      count: totalCampaigns,
      icon: <Megaphone className="h-6 w-6 text-blue-500" />,
      bg: 'bg-zinc-50',
    },
    {
      label: 'Sent All Time',
      count: sentAllTime,
      icon: <CalendarCheck className="h-6 w-6 text-green-500" />,
      bg: 'bg-zinc-50',
    },
    {
      label: 'Scheduled',
      count: scheduledCampaigns,
      icon: <Clock className="h-6 w-6 text-orange-500" />,
      bg: 'bg-zinc-50',
    },
    {
      label: 'Drafts',
      count: draftCampaigns,
      icon: <Pencil className="h-6 w-6 text-zinc-500" />,
      bg: 'bg-zinc-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-4 rounded-lg border border-zinc-200 p-4 ${card.bg}`}
        >
          <div className="rounded-md bg-white p-2 shadow-sm">{card.icon}</div>
          <div>
            <p className="text-sm text-zinc-500">{card.label}</p>
            <p className="text-lg font-semibold text-zinc-800">{card.count}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
