import { createClient } from '@/lib/supabase/server'

export async function getPhoneNumber() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  const { data, error } = await supabase
    .from('phone_numbers')
    .select('id, number, twilio_phone_sid, country, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    throw new Error('Failed to fetch phone number')
  }

  return data
}
