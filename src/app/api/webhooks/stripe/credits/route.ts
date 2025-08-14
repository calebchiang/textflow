import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { addCredits } from '@/lib/webhooks/stripe/addCredits'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
})

const PRICE_TO_VOLUME: Record<string, number> = {
  'price_1Rv8WuCAfJr8g33JE6br0s4P': 100,
  'price_1Rv8XYCAfJr8g33Jq2OgtfSV': 500,
  'price_1Rv8Y9CAfJr8g33JPa8hnVHA': 1000,
  'price_1Rv8YkCAfJr8g33J5xcKWEvx': 2000,
  'price_1Rv8ZKCAfJr8g33J9N87YG7z': 5000,
  'price_1Rv8ZwCAfJr8g33JPzNHM4nq': 10000,
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature') || ''
  const rawBody = await req.arrayBuffer()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(rawBody),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET_CREDITS!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      // Only handle credits purchases
      if (session.metadata?.purchase_type !== 'credits') {
        return NextResponse.json({ received: true })
      }
      if (session.payment_status !== 'paid') {
        return NextResponse.json({ received: true })
      }

      let userId = session.metadata?.user_id || ''
      let volume = Number(session.metadata?.credit_volume || 0)

      // Fallback: map price.id → volume if metadata missing
      if ((!userId || !volume) && session.id) {
        const full = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items.data.price'],
        })
        const priceId = full.line_items?.data?.[0]?.price?.id
        if (priceId && PRICE_TO_VOLUME[priceId]) {
          volume = PRICE_TO_VOLUME[priceId]
        }
      }

      if (!userId || !volume || Number.isNaN(volume)) {
        console.warn('Missing user_id or volume for session:', session.id)
        return NextResponse.json({ received: true })
      }

      await addCredits({ userId, amount: volume })
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Stripe credits webhook error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
