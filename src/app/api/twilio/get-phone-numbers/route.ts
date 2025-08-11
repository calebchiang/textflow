import { NextResponse } from 'next/server'
import { getAvailablePhoneNumbers } from '@/lib/twilio/getPhoneNumbers'

export async function POST() {
  try {
    const numbers = await getAvailablePhoneNumbers()
    return NextResponse.json({ numbers })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch numbers' },
      { status: 500 }
    )
  }
}
