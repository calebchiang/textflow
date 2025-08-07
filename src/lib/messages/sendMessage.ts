import { createClient } from '@/lib/supabase/server'
import { sendSMS } from '@/lib/twilio/sendSMS'

interface SendPayload {
  conversationId: string
  content: string
}

type Conversation = {
  id: string
  contact_id: string
  contacts: {
    phone_number: string
  } | null
}

export async function sendMessage({ conversationId, content }: SendPayload) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  if (!conversationId || !content) {
    throw new Error('Missing conversationId or content')
  }

  // 1. Fetch conversation with contact's phone number
  const { data: conversation, error: convoError } = await supabase
    .from('conversations')
    .select('id, contact_id, contacts ( phone_number )')
    .eq('id', conversationId)
    .eq('user_id', user.id)
    .single<Conversation>()

  if (convoError || !conversation) {
    throw new Error('Conversation not found')
  }

  const to = conversation.contacts?.phone_number
  if (!to) {
    throw new Error('Contact has no phone number')
  }

  // 2. Send SMS via Twilio
  await sendSMS(to, content)

  // 3. Insert message with recipient_id
  const { data: newMessage, error: messageError } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      recipient_id: conversation.contact_id, 
      content,
      status: 'sent',
      delivered_at: new Date(), 
    })
    .select('id, content, created_at, sender_id')
    .single()

  if (messageError) {
    console.error('Insert message error:', messageError)
    throw new Error('Failed to save message')
  }

  // 4. Update conversation timestamps
  await supabase
    .from('conversations')
    .update({
      last_message_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', conversationId)

  return { message: newMessage }
}
