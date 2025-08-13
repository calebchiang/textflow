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

  let phoneOwner = null as null | { user_id: string }
  {
    const { data } = await supabase
      .from('phone_numbers')
      .select('user_id')
      .eq('number', to)
      .maybeSingle()
    
    phoneOwner = data ?? null
  }

  if (!phoneOwner) {
    console.warn(`No phone owner found for To: ${to}`)
    return `<Response></Response>`
  }

  let fromNormalized = from
  if (fromNormalized.startsWith('+1')) {
    fromNormalized = fromNormalized.substring(2)
  }

  const { data: contact, error: contactError } = await supabase
    .from('contacts')
    .select('id, user_id')
    .eq('user_id', phoneOwner.user_id)
    .eq('phone_number', fromNormalized)
    .maybeSingle()

  if (contactError || !contact) {
    console.warn(`Contact not found for user ${phoneOwner.user_id} phone: ${fromNormalized}`)
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
      sender_id: contact.id,
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
