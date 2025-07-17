import { createClient } from '@/lib/supabase/server'

interface AddPayload {
  first_name: string
  last_name?: string
  phone_number: string
  list_id: string
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

  const { first_name, last_name, phone_number, list_id } = payload

  if (!first_name || !phone_number || !list_id) {
    throw new Error('Missing required fields')
  }

  const { data, error } = await supabase
    .from('contacts')
    .insert({
      user_id: user.id,
      first_name,
      last_name,
      phone_number,
      list_id,
    })
    .select('id, phone_number, first_name, last_name, created_at, lists(name)')
    .single()

  if (error || !data) {
    throw new Error('Failed to add contact')
  }

  return data
}
