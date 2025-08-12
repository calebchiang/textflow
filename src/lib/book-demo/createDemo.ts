import { createClient } from '@/lib/supabase/server'

type CreateDemoPayload = {
  email: string
}

export async function createDemo(payload: CreateDemoPayload) {
  const supabase = await createClient()

  const email = (payload?.email || '').trim().toLowerCase()
  if (!email) throw new Error('Email is required')

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  if (!isEmail) throw new Error('Invalid email address')

  const { data, error } = await supabase
    .from('demo_leads')
    .insert({ email })
    .select('id, email, created_at')
    .single()

  if (error || !data) {
    throw new Error('Failed to create demo lead')
  }

  return data
}
