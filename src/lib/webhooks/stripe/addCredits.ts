import { serviceSupabase } from '@/lib/supabase/service'

type Params = {
  userId: string
  amount: number
}

export async function addCredits({ userId, amount }: Params) {
  if (!userId || !Number.isFinite(amount) || amount <= 0) {
    throw new Error('Invalid params to addCredits')
  }

  // Read current credits
  const { data: profile, error: selErr } = await serviceSupabase
    .from('profiles')
    .select('credits')
    .eq('id', userId)
    .single()

  if (selErr) {
    throw new Error(`profiles select failed: ${selErr.message}`)
  }

  const current = Number(profile?.credits ?? 0)
  const next = current + amount

  // Update with new total
  const { error: updErr } = await serviceSupabase
    .from('profiles')
    .update({ credits: next })
    .eq('id', userId)

  if (updErr) {
    throw new Error(`profiles update failed: ${updErr.message}`)
  }

  return { user_id: userId, added: amount, credits: next }
}
