import { createClient } from '@/lib/supabase/server'

interface AddPayload {
  first_name: string
  last_name?: string
  phone_number: string
}

export async function addContact(payload: AddPayload) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  const { first_name, last_name, phone_number } = payload

  if (!first_name || !phone_number) {
    throw new Error('Missing required fields')
  }

  const { data, error } = await supabase
    .from('contacts')
    .insert({
      user_id: user.id,
      first_name,
      last_name,
      phone_number,
    })
    .select()
    .single()

  if (error || !data) {
    throw new Error('Failed to add contact')
  }

  return data
}
