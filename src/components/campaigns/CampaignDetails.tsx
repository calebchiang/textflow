'use client'

import { useState } from 'react'
import clsx from 'clsx'
import CampaignIdOverview from './CampaignIdOverview'

export default function CampaignDetails({ campaign }: { campaign: any }) {
  const [name, setName] = useState(campaign.name)

  const status = campaign.status || 'draft'

  const statusConfig: Record<string, { label: string; color: string }> = {
    draft: { label: 'Draft', color: 'bg-zinc-400' },
    scheduled: { label: 'Scheduled', color: 'bg-yellow-500' },
    sent: { label: 'Sent', color: 'bg-green-500' },
  }

  const statusInfo = statusConfig[status] || statusConfig['draft']

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">{name}</h1>
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <span className={clsx('w-2.5 h-2.5 rounded-full', statusInfo.color)} />
          <span>Status: {statusInfo.label}</span>
        </div>
      </div>

      <CampaignIdOverview
        messagesSent={10} // TODO: Replace with actual values
        messagesScheduled={5}
        failedDeliveries={2}
        repliesReceived={3}
      />
    </>
  )
}
