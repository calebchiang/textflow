import { createClient } from '@/lib/supabase/server'

export async function getUserProfile() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  const { data: profile, error: fetchError } = await supabase
    .from('user_profiles')
    .select('id, user_id, onboarding_complete, created_at')
    .eq('user_id', user.id)
    .maybeSingle()

  if (fetchError || !profile) {
    throw new Error('User profile not found')
  }

  return profile
}
