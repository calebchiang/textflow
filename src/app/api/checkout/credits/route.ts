import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
})

const PRICE_IDS: Record<number, string> = {
  100:   'price_1Rw8moCBOVEIoveVHCDdCMb4',
  500:   'price_1Rw8mvCBOVEIoveVA4AieTiD',
  1000:  'price_1Rw8nACBOVEIoveVvAMAwD0U',
  2000:  'price_1Rw8nCCBOVEIoveVvuptswsv',
  5000:  'price_1Rw8nGCBOVEIoveVuZneemrs',
  10000: 'price_1Rw8nICBOVEIoveVyQUZkcic',
}

const PLAN_TO_VOLUME: Record<string, number> = {
  sms_100: 100,
  sms_500: 500,
  sms_1000: 1000,
  sms_2000: 2000,
  sms_5000: 5000,
  sms_10000: 10000,
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { volume: rawVolume, plan } = body as { volume?: number; plan?: string }

    const resolvedVolume =
      typeof rawVolume === 'number' && PRICE_IDS[rawVolume]
        ? rawVolume
        : plan && PLAN_TO_VOLUME[plan]
        ? PLAN_TO_VOLUME[plan]
        : undefined

    if (!resolvedVolume) {
      return NextResponse.json(
        { error: 'Invalid volume/plan. Expected one of 100, 500, 1000, 2000, 5000, 10000 or plan sms_*.' },
        { status: 400 }
      )
    }

    const priceId = PRICE_IDS[resolvedVolume]
    if (!priceId) {
      return NextResponse.json({ error: 'Price ID not configured for that volume.' }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const session = await stripe.checkout.sessions.create({
      mode: 'payment', 
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?purchase=credits&status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?purchase=credits&status=cancelled`,
      customer_email: user?.email || undefined,
      metadata: {
        user_id: user?.id ?? '',
        credit_volume: String(resolvedVolume),
        purchase_type: 'credits',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Stripe Credits Checkout Error:', error)
    return NextResponse.json({ error: error?.message || 'Unknown error' }, { status: 500 })
  }
}
