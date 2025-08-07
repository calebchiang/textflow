'use client'

import { Plus } from 'lucide-react'
import Link from 'next/link'

interface Campaign {
  id: string
  name: string
  message: string
  status: string
  scheduled_at: string | null
  sent_at: string | null
  created_at: string
  lists?: {
    name: string
  } | null
}

interface CampaignsListProps {
  campaigns: Campaign[]
  loading: boolean
  onAddCampaign: () => void  
}

export default function CampaignsList({ campaigns, loading, onAddCampaign }: CampaignsListProps) {
  return (
    <div className="mt-6 w-full">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onAddCampaign}
          className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Create Campaign
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 rounded-md bg-zinc-100 animate-pulse" />
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="w-full text-center text-zinc-500">No campaigns yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
            <thead className="bg-zinc-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-600">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-600">List</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-600">Scheduled</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-600">Sent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
            {campaigns.map((campaign, index) => (
              <tr
                key={campaign.id}
                className={`${index % 2 === 1 ? 'bg-zinc-50' : ''}`}
              >
                <td className="px-4 py-3 text-sm text-emerald-600 font-medium hover:underline">
                  <Link href={`/campaigns/${campaign.id}`}>
                    {campaign.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-zinc-800">{campaign.lists?.name || 'All Contacts'}</td>
                <td className="px-4 py-3 text-sm text-zinc-800 capitalize">{campaign.status}</td>
                <td className="px-4 py-3 text-sm text-zinc-600">
                  {campaign.scheduled_at ? new Date(campaign.scheduled_at).toLocaleString() : '-'}
                </td>
                <td className="px-4 py-3 text-sm text-zinc-600">
                  {campaign.sent_at ? new Date(campaign.sent_at).toLocaleString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
