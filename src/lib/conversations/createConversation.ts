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

  if (userError || !user) throw new Error('Unauthorized')
  if (!contact_id || !message) throw new Error('Missing contact_id or message')

  const { data: contact, error: contactError } = await supabase
    .from('contacts')
    .select('id, phone_number')
    .eq('id', contact_id)
    .eq('user_id', user.id)
    .single()

  if (contactError || !contact) throw new Error('Contact not found')

  const { data: phone, error: phoneErr } = await supabase
    .from('phone_numbers')
    .select('number, status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (phoneErr) {
    console.error('phone_numbers select error:', phoneErr)
    throw new Error('Failed to fetch your sending number')
  }
  if (!phone?.number) {
    throw new Error('No sending number found. Please purchase a Toll-Free number first.')
  }

  if (phone.status !== 'verified') {
    const err: any = new Error('Number not verified')
    err.code = 'NUMBER_NOT_VERIFIED'
    throw err
  }

  await sendSMS(contact.phone_number, message, phone.number)

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

    if (convoError || !convo) throw new Error('Failed to create conversation')
    conversationId = convo.id
  }

  const { data: newMessage, error: messageError } = await supabase
    .from('messages')
    .insert({
      sender_id: user.id,
      recipient_id: contact.id,
      conversation_id: conversationId,
      content: message,
      status: 'sent',
      delivered_at: new Date(),
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
