import { NextResponse } from 'next/server'
import { addCampaign } from '@/lib/campaigns/addCampaign'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const campaign = await addCampaign(body)
    return NextResponse.json({ campaign })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 400 }
    )
  }
}
