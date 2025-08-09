import twilio from 'twilio'
import { serviceSupabase } from '@/lib/supabase/service'

type Params = {
  userId: string
  selectedNumber: string // E.164
}

export async function phoneNumberConfirmation({ userId, selectedNumber }: Params) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID!
  const authToken = process.env.TWILIO_AUTH_TOKEN!
  const client = twilio(accountSid, authToken)

  if (!/^\+\d{8,15}$/.test(selectedNumber)) {
    throw new Error('Invalid phone number format')
  }

  const purchased = await client.incomingPhoneNumbers.create({
    phoneNumber: selectedNumber,
  })

  console.log('📞 Twilio purchase response:', JSON.stringify(purchased, null, 2))

  const country = 'ca' // TODO: make dynamic later
  const { error: insertError } = await serviceSupabase.from('phone_numbers').insert({
    user_id: userId,
    number: purchased.phoneNumber,
    twilio_phone_sid: purchased.sid,
    country,
  })

  if (insertError) {
    throw new Error(`DB insert failed: ${insertError.message}`)
  }

  return {
    user_id: userId,
    number: purchased.phoneNumber,
    twilio_phone_sid: purchased.sid,
    status: 'active',
  }
}
