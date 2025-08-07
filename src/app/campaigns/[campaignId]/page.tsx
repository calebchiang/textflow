import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CampaignDetails from '@/components/campaigns/CampaignDetails'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

type CampaignPageProps = {
  params: Promise<{ campaignId: string }>
}

export default async function CampaignPage({ params }: CampaignPageProps) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: campaign, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', resolvedParams.campaignId)
    .single()

  if (error || !campaign) return notFound()

  return (
    <main className="ml-60 min-h-screen bg-zinc-50 px-6 py-6 text-zinc-800">
      <Link
        href="/campaigns"
        className="mb-2 inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to campaigns
      </Link>

      <CampaignDetails campaign={campaign} />
    </main>
  )
}