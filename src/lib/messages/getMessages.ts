import { createClient } from '@/lib/supabase/server'

export async function getMessages(conversationId: string) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('Auth error:', userError)
    throw new Error('Unauthorized')
  }

  console.log('Fetching messages for conversationId:', conversationId)
  console.log('Authenticated user ID:', user.id)

  const { data, error } = await supabase
    .from('messages')
    .select('id, conversation_id, sender_id, content, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Supabase query error:', error)
    console.error('conversationId sent:', conversationId)
    throw new Error('Failed to fetch messages')
  }

  console.log('Messages fetched successfully:', data?.length)
  return { messages: data, userId: user.id }
}
