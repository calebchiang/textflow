import { createClient } from '@/lib/supabase/server'

interface AddCampaignPayload {
  name: string
  message: string
  sendToAll: boolean
  selectedLists: string[]
  sendNow: boolean
  scheduledDate?: string  
  scheduledTime?: string  
}

export async function addCampaign(payload: AddCampaignPayload) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  const { name, message, sendToAll, selectedLists, sendNow, scheduledDate, scheduledTime } = payload

  if (!name || !message) {
    throw new Error('Missing required fields')
  }

  let scheduled_at = null
  if (!sendNow && scheduledDate && scheduledTime) {
    scheduled_at = new Date(`${scheduledDate}T${scheduledTime}:00`)
  }

  const list_id = sendToAll ? null : selectedLists[0] || null

  const { data, error } = await supabase
    .from('campaigns')
    .insert({
      user_id: user.id,
      name,
      message,
      list_id,
      status: sendNow ? 'queued' : 'scheduled',
      scheduled_at,
    })
    .select('*')
    .single()

  if (error || !data) {
    throw new Error('Failed to add campaign')
  }

  return data
}
