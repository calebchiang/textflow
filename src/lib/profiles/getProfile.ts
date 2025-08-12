import { createClient } from '@/lib/supabase/server'

type ProfileRow = {
  id: string
  credits: number | null
  created_at: string | null
}

export async function getProfile(): Promise<ProfileRow | null> {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, credits, created_at')
    .eq('id', user.id)
    .maybeSingle<ProfileRow>()

  if (error) {
    throw new Error('Failed to fetch profile')
  }

  return data ?? null
}
