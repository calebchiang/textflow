import { createClient } from '@/lib/supabase/server'

export async function addList(name: string) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  if (!name) {
    throw new Error('Missing list name')
  }

  const { data, error } = await supabase
    .from('lists')
    .insert({ name, user_id: user.id })
    .select()
    .single()

  if (error) {
    throw new Error('Failed to create list')
  }

  return data
}
