import { createClient } from '@/lib/supabase/server'

export async function getContacts() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  const { data, error } = await supabase
    .from('contacts')
    .select('id, phone_number, first_name, last_name, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Failed to fetch contacts')
  }

  return data
}
