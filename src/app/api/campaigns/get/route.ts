import { NextResponse } from 'next/server'
import { getCampaigns } from '@/lib/campaigns/getCampaigns'

export async function GET() {
  try {
    const campaigns = await getCampaigns()
    return NextResponse.json({ campaigns })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 401 }
    )
  }
}
