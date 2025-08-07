import { NextRequest, NextResponse } from 'next/server'
import { getAvailablePhoneNumbers } from '@/lib/twilio/getPhoneNumbers'

export async function POST(req: NextRequest) {
  const { areaCode } = await req.json()

  try {
    const numbers = await getAvailablePhoneNumbers(areaCode)
    return NextResponse.json({ numbers })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch numbers' }, { status: 500 })
  }
}
