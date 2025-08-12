import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { phoneNumberConfirmation } from '@/lib/webhooks/stripe/phoneNumberConfirmation'

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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.user_id
    const selectedNumber = session.metadata?.selected_number
    const subscriptionId =
      typeof session.subscription === 'string' ? session.subscription : null

    if (!userId || !selectedNumber || !subscriptionId) {
      console.error('Missing user_id, selected_number, or subscription in session.')
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 })
    }

    try {
      const result = await phoneNumberConfirmation({
        userId,
        selectedNumber,
        stripeSubscriptionId: subscriptionId,
      })
      console.log('Provisioned number:', result)
    } catch (e: any) {
      console.error('Provisioning failed:', e?.message || e)
      return NextResponse.json({ received: true, error: 'provisioning_failed' })
    }
  }

  return NextResponse.json({ received: true })
}
