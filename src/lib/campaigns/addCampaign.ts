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

  // Prepare timestamp if scheduled
  let scheduled_at = null
  if (!sendNow && scheduledDate && scheduledTime) {
    scheduled_at = new Date(`${scheduledDate}T${scheduledTime}:00`)
  }

  const list_id = sendToAll ? null : selectedLists[0] || null

  // 1. Create campaign
  const { data: campaign, error: campaignError } = await supabase
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

  if (campaignError || !campaign) {
    throw new Error('Failed to create campaign')
  }

  // 2. Get contacts based on list
  let contactQuery = supabase
    .from('contacts')
    .select('id, phone_number')
    .eq('user_id', user.id)

  if (list_id) {
    contactQuery = contactQuery.eq('list_id', list_id)
  }

  const { data: contacts, error: contactError } = await contactQuery

  if (contactError || !contacts || contacts.length === 0) {
    throw new Error('No contacts found for campaign')
  }

  // 3. Prepare message inserts
  const messagesToInsert = contacts.map((contact) => ({
    sender_id: user.id,
    recipient_id: contact.id, 
    campaign_id: campaign.id,
    content: message,
    status: sendNow ? 'queued' : 'scheduled',
    scheduled_at,
    conversation_id: null,
  }))

  const { error: messageInsertError } = await supabase
    .from('messages')
    .insert(messagesToInsert)

  if (messageInsertError) {
    console.error('Failed to insert messages:', messageInsertError)
    throw new Error('Failed to schedule messages for campaign')
  }

  return campaign
}
