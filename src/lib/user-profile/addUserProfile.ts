import { createClient } from '@/lib/supabase/server'

export async function addUserProfile() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  const { data: existingProfile, error: fetchError } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (fetchError) {
    throw new Error('Failed to fetch user profile')
  }

  if (existingProfile) {
    return existingProfile
  }

  const { data: newProfile, error: insertError } = await supabase
    .from('user_profiles')
    .insert({
      user_id: user.id,
      onboarding_complete: false,
    })
    .select('id, user_id, onboarding_complete, created_at')
    .single()

  if (insertError || !newProfile) {
    throw new Error('Failed to create user profile')
  }

  return newProfile
}
