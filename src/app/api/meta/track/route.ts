import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const DATASET_ID = process.env.FACEBOOK_DATASET_ID!
const ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN!

const sha256 = (s: string) =>
  crypto.createHash('sha256').update(s.trim().toLowerCase()).digest('hex')

function getClientIp(req: NextRequest) {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return req.headers.get('x-real-ip') || undefined
}

export async function POST(req: NextRequest) {
  try {
    const { event_name, email, event_source_url } = await req.json()

    if (!event_name) {
      return NextResponse.json({ error: 'event_name is required' }, { status: 400 })
    }

    const user_data: Record<string, any> = {
      client_user_agent: req.headers.get('user-agent') || undefined,
      client_ip_address: getClientIp(req),
    }
    if (email) user_data.em = [sha256(email)]

    const payload = {
      data: [{
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url,
        user_data,
      }],
    }

    const res = await fetch(
      `https://graph.facebook.com/v19.0/${DATASET_ID}/events?access_token=${ACCESS_TOKEN}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
    )
    const out = await res.json()
    if (!res.ok) return NextResponse.json({ error: out }, { status: res.status })

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}
