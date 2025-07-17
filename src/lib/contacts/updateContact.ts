import { createClient } from '@/lib/supabase/server'

interface UpdatePayload {
  id: string
  first_name?: string
  last_name?: string
  phone_number?: string
  list_id?: string
}

export async function updateContact(payload: UpdatePayload) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  const { id, ...fieldsToUpdate } = payload

  if (Object.keys(fieldsToUpdate).length === 0) {
    throw new Error('No fields provided to update')
  }

  const { data, error } = await supabase
    .from('contacts')
    .update(fieldsToUpdate)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('id, phone_number, first_name, last_name, created_at, list_id, lists(name)')
    .single()

  if (error || !data) {
    throw new Error('Failed to update contact')
  }

  return data
}
