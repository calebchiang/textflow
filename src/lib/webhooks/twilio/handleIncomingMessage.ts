import { serviceSupabase } from '@/lib/supabase/service'

export async function handleIncomingMessage(formData: FormData) {
  const supabase = serviceSupabase

  let from = formData.get('From') as string
  const to = formData.get('To') as string
  const body = formData.get('Body') as string
  const messageSid = formData.get('MessageSid') as string

  if (!from || !body) {
    throw new Error('Missing required fields from Twilio webhook')
  }

  // Normalize the phone number by removing +1 (for US/Canada numbers)
  if (from.startsWith('+1')) {
    from = from.substring(2) // Removes +1
  }

  const { data: contact, error: contactError } = await supabase
    .from('contacts')
    .select('id, user_id')
    .eq('phone_number', from)
    .single()

  if (contactError || !contact) {
    console.warn(`Contact not found for phone: ${from}`)
    return `<Response></Response>`
  }

  const { data: conversation, error: convoError } = await supabase
    .from('conversations')
    .select('id')
    .eq('contact_id', contact.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (convoError || !conversation) {
    console.warn(`Conversation not found for contact: ${contact.id}`)
    return `<Response></Response>`
  }

  const { error: messageError } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversation.id,
      sender_id: contact.id, // Sender is the Contact (inbound)
      content: body,
    })

  if (messageError) {
    console.error('Failed to save message:', messageError)
    throw new Error('Failed to save message')
  }

  const now = new Date().toISOString()
  await supabase
    .from('conversations')
    .update({
      last_message_at: now,
      updated_at: now,
    })
    .eq('id', conversation.id)

  return `<Response></Response>`
}
