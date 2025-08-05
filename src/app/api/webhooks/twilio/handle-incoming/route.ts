import { NextResponse } from 'next/server'
import { handleIncomingMessage } from '@/lib/webhooks/twilio/handleIncomingMessage'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const responseXml = await handleIncomingMessage(formData)
    return new Response(responseXml, {
      headers: { 'Content-Type': 'text/xml' }
    })
  } catch (err: any) {
    console.error('Twilio Webhook Error:', err)
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}
