import { createClient } from '@/lib/supabase/server'

export async function getCampaigns() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  const { data, error } = await supabase
    .from('campaigns')
    .select('id, name, message, status, scheduled_at, sent_at, created_at, list_id, lists(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Failed to fetch campaigns')
  }

  return data
}
