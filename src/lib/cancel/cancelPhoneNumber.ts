import Stripe from 'stripe'
import twilio from 'twilio'
import { createClient } from '@/lib/supabase/server'

export async function cancelPhoneNumber(userId: string) {
  const supabase = await createClient()

  const { data: row, error: fetchErr } = await supabase
    .from('phone_numbers')
    .select('id, stripe_subscription_id, twilio_phone_sid')
    .eq('user_id', userId)
    .limit(1)
    .maybeSingle()

  if (fetchErr) throw new Error('Failed to load phone number')
  if (!row?.stripe_subscription_id || !row?.twilio_phone_sid) {
    throw new Error('No active subscription/number found')
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-07-30.basil',
  })

  // 1) cancel subscription immediately
  await stripe.subscriptions.cancel(row.stripe_subscription_id)

  // 2) release twilio number
  const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!)
  await client.incomingPhoneNumbers(row.twilio_phone_sid).remove()

  // 3) delete the db row
  const { error: delErr } = await supabase
    .from('phone_numbers')
    .delete()
    .eq('id', row.id)

  if (delErr) throw new Error('Failed to delete phone number record')

  return {
    ok: true as const,
    deleted_phone_number_id: row.id,
    stripe_subscription_id: row.stripe_subscription_id,
  }
}
