'use client'

import { useEffect, useState } from 'react'
import CampaignOverview from '@/components/campaigns/CampaignOverview'
import CampaignsList from '@/components/campaigns/CampaignsList'
import AddCampaignModal from '@/components/campaigns/AddCampaignModal'

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  const fetchCampaigns = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/campaigns/get')
      const { campaigns } = await res.json()
      setCampaigns(campaigns)
    } catch (err) {
      console.error('Error fetching campaigns:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const sentCampaigns = campaigns.filter((c) => c.sent_at !== null).length
  const scheduledCampaigns = campaigns.filter((c) => c.scheduled_at !== null && c.sent_at === null).length
  const draftCampaigns = campaigns.filter((c) => c.scheduled_at === null && c.sent_at === null).length

  return (
    <main className="ml-60 flex min-h-screen flex-col items-start justify-start bg-zinc-50 px-4 text-zinc-800">
      <h1 className="mt-6 text-2xl font-semibold">Campaigns</h1>
      <p className="mt-1 text-zinc-600">Send SMS campaigns to your audience.</p>

      <div className="mt-6 w-full">
        <CampaignOverview
          totalCampaigns={campaigns.length}
          sentAllTime={sentCampaigns}
          scheduledCampaigns={scheduledCampaigns}
          draftCampaigns={draftCampaigns}
        />
        <CampaignsList
          campaigns={campaigns}
          loading={loading}
          onAddCampaign={() => setShowAddModal(true)}
        />
      </div>

      {showAddModal && (
        <AddCampaignModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onCampaignCreated={fetchCampaigns}  
        />
      )}
    </main>
  )
}
