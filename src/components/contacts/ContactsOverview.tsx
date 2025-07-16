'use client'

import { Users, UserPlus, UserX, UserMinus } from 'lucide-react'

interface ContactsOverviewProps {
  totalContacts: number
  newThisMonth: number
}

export default function ContactsOverview({ totalContacts, newThisMonth }: ContactsOverviewProps) {
  const cards = [
    {
      label: 'All contacts',
      count: totalContacts,
      icon: <Users className="h-6 w-6 text-blue-500" />,
      bg: 'bg-zinc-50',
    },
    {
      label: 'New this month',
      count: newThisMonth,
      icon: <UserPlus className="h-6 w-6 text-green-500" />,
      bg: 'bg-zinc-50',
    },
    {
      label: 'Unsubscribed',
      count: 0,
      icon: <UserMinus className="h-6 w-6 text-orange-500" />,
      bg: 'bg-zinc-50',
    },
    {
      label: 'Invalid',
      count: 0,
      icon: <UserX className="h-6 w-6 text-red-500" />,
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
