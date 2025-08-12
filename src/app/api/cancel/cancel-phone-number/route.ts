import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cancelPhoneNumber } from '@/lib/cancel/cancelPhoneNumber'

export async function POST() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const result = await cancelPhoneNumber(user.id)
    return NextResponse.json(result)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Cancel failed' }, { status: 400 })
  }
}
