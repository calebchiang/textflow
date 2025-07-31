import { createClient } from '@/lib/supabase/server'
import { sendSMS } from '@/lib/twilio/sendSMS'

interface CreatePayload {
  contact_id: string
  message: string
}

export async function createConversation({ contact_id, message }: CreatePayload) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  if (!contact_id || !message) {
    throw new Error('Missing contact_id or message')
  }

  const { data: contact, error: contactError } = await supabase
    .from('contacts')
    .select('id, phone_number')
    .eq('id', contact_id)
    .eq('user_id', user.id)
    .single()

  if (contactError || !contact) {
    throw new Error('Contact not found')
  }

  await sendSMS(contact.phone_number, message)
  const { data: existingConvo } = await supabase
    .from('conversations')
    .select('id')
    .eq('user_id', user.id)
    .eq('contact_id', contact_id)
    .maybeSingle()

  let conversationId = existingConvo?.id

  if (!conversationId) {
    const { data: convo, error: convoError } = await supabase
      .from('conversations')
      .insert({
        user_id: user.id,
        contact_id,
        last_message_at: new Date(),
      })
      .select('id')
      .single()

    if (convoError || !convo) {
      throw new Error('Failed to create conversation')
    }

    conversationId = convo.id
  }

  const { data: newMessage, error: messageError } = await supabase
    .from('messages')
    .insert({
      sender_id: user.id,              
      conversation_id: conversationId, 
      content: message,                
    })
    .select('id, content, created_at')
    .single()

  if (messageError) {
    console.error('Message insert error:', messageError)
    throw new Error('Failed to create message')
  }

  return {
    conversation_id: conversationId,
    message: newMessage,
  }
}
