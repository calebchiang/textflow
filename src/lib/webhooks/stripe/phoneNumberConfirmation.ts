import twilio from 'twilio'
import { serviceSupabase } from '@/lib/supabase/service'

type Params = {
  userId: string
  selectedNumber: string
  stripeSubscriptionId: string
}

export async function phoneNumberConfirmation({ userId, selectedNumber, stripeSubscriptionId }: Params) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID!
  const authToken = process.env.TWILIO_AUTH_TOKEN!
  const client = twilio(accountSid, authToken)

  if (!/^\+\d{8,15}$/.test(selectedNumber)) {
    throw new Error('Invalid phone number format')
  }

  const purchased = await client.incomingPhoneNumbers.create({
    phoneNumber: selectedNumber,
  })

  const country = 'ca'
  const { error: insertError } = await serviceSupabase.from('phone_numbers').insert({
    user_id: userId,
    number: purchased.phoneNumber,
    twilio_phone_sid: purchased.sid,
    country,
    stripe_subscription_id: stripeSubscriptionId,
    status: 'unverified',
  })

  if (insertError) {
    throw new Error(`DB insert failed: ${insertError.message}`)
  }

  return {
    user_id: userId,
    number: purchased.phoneNumber,
    twilio_phone_sid: purchased.sid,
    stripe_subscription_id: stripeSubscriptionId,
    status: 'unverified',
  }
}
