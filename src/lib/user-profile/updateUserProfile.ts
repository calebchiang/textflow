import { createClient } from '@/lib/supabase/server'

export async function updateUserProfile(body: any) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  const {
    country,
    business_name,
    business_type,
    industry,
    website,
    street,
    city,
    state_prov,
    zip,
    phone,
    email,
  } = body

  const updateData: any = {
    country,
    onboarding_complete: true, 
  }

  if (country !== 'canada') {
    Object.assign(updateData, {
      business_name,
      business_type,
      industry,
      website,
      street,
      city,
      state_prov,
      zip,
      phone,
      email,
    })
  }

  const { error } = await supabase
    .from('user_profiles')
    .update(updateData)
    .eq('user_id', user.id)

  if (error) {
    throw new Error('Failed to update user profile')
  }

  return updateData
}
