import { createClient } from '@/lib/supabase/server'
import { sendSMS } from '@/lib/twilio/sendSMS'
import { countSmsSegments } from '@/lib/calculateSegments'

interface SendPayload { conversationId: string; content: string }
type Conversation = { id: string; contact_id: string; contacts: { phone_number: string } | null }

export async function sendMessage({ conversationId, content }: SendPayload) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) throw new Error('Unauthorized')
  if (!conversationId || !content) throw new Error('Missing conversationId or content')

  const { data: conversation, error: convoError } = await supabase
    .from('conversations')
    .select('id, contact_id, contacts ( phone_number )')
    .eq('id', conversationId)
    .eq('user_id', user.id)
    .single<Conversation>()
  if (convoError || !conversation) throw new Error('Conversation not found')

  const to = conversation.contacts?.phone_number
  if (!to) throw new Error('Contact has no phone number')

  const { data: phone, error: phoneErr } = await supabase
    .from('phone_numbers')
    .select('number, status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (phoneErr) throw new Error('Failed to fetch your sending number')
  if (!phone?.number) throw new Error('No sending number found. Please purchase a Toll-Free number first.')
  if (phone.status !== 'verified') {
    const err: any = new Error('Number not verified')
    err.code = 'NUMBER_NOT_VERIFIED'
    throw err
  }

  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', user.id)
    .single<{ credits: number }>()
  if (profileErr) throw new Error('Failed to check credits')

  const segments = countSmsSegments(content)
  if ((profile?.credits ?? 0) < segments) {
    const err: any = new Error('Insufficient credits')
    err.code = 'INSUFFICIENT_CREDITS'
    throw err
  }

  await sendSMS(to, content, phone.number)

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
  if (messageError) throw new Error('Failed to save message')

  await supabase
    .from('conversations')
    .update({
      last_message_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', conversationId)

  const { error: decErr } = await supabase
    .from('profiles')
    .update({ credits: (profile!.credits || 0) - segments })
    .eq('id', user.id)
  if (decErr) console.error('Failed to decrement credits after send:', decErr)

  return { message: newMessage }
}
