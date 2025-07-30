import { createClient } from '@/lib/supabase/server'

export async function getConversations() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  const { data, error } = await supabase
    .from('conversations')
    .select('id, contact_id, created_at, contacts(first_name, last_name, phone_number)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Failed to fetch conversations')
  }

  return data
}
