import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { phoneNumberConfirmation } from '@/lib/webhooks/stripe/phoneNumberConfirmation' // ⬅️ added

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
})

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature') || ''
  const rawBody = await req.arrayBuffer()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(rawBody),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log('Stripe webhook received. Event type:', event.type)

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.user_id
    const selectedNumber = session.metadata?.selected_number

    console.log('Phone number from metadata:', selectedNumber)

    if (!userId || !selectedNumber) {
      console.error('Missing user_id or selected_number in metadata.')
      return NextResponse.json({ error: 'Missing required metadata' }, { status: 400 })
    }

    try {
      const result = await phoneNumberConfirmation({ userId, selectedNumber })
      console.log('✅ Provisioned number:', result)
    } catch (e: any) {
      console.error('❌ Provisioning failed:', e?.message || e)
      return NextResponse.json({ received: true, error: 'provisioning_failed' })
    }
  }

  return NextResponse.json({ received: true })
}
