import { NextRequest, NextResponse } from 'next/server'
import { sendSMS } from '@/lib/twilio/sendSMS'

export async function POST(req: NextRequest) {
  const { to, message } = await req.json()

  if (!to || !message) {
    return NextResponse.json({ error: 'Missing to or message' }, { status: 400 })
  }

  try {
    const result = await sendSMS(to, message)
    return NextResponse.json({ sid: result.sid })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
