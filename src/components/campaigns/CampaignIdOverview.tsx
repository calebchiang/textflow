'use client'

import { CheckCircle, Clock, XCircle, MessageCircle } from 'lucide-react'

interface CampaignIdOverviewProps {
  messagesSent: number
  messagesScheduled: number
  failedDeliveries: number
  repliesReceived: number
}

export default function CampaignIdOverview({
  messagesSent,
  messagesScheduled,
  failedDeliveries,
  repliesReceived
}: CampaignIdOverviewProps) {
  const cards = [
    {
      label: 'Messages Sent',
      count: messagesSent,
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      bg: 'bg-zinc-50',
    },
    {
      label: 'Scheduled',
      count: messagesScheduled,
      icon: <Clock className="h-6 w-6 text-yellow-500" />,
      bg: 'bg-zinc-50',
    },
    {
      label: 'Failed Deliveries',
      count: failedDeliveries,
      icon: <XCircle className="h-6 w-6 text-red-500" />,
      bg: 'bg-zinc-50',
    },
    {
      label: 'Replies Received',
      count: repliesReceived,
      icon: <MessageCircle className="h-6 w-6 text-blue-500" />,
      bg: 'bg-zinc-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full mb-8">
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
