// app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/login', url.origin))
  }

  const supabase = await createClient()

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
  if (exchangeError) {
    console.error('Error exchanging code:', exchangeError.message)
    return NextResponse.redirect(new URL('/login?message=Auth%20error', url.origin))
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    console.error('Error fetching user:', userError?.message)
    return NextResponse.redirect(new URL('/login', url.origin))
  }

  const { data: existingProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()
  if (fetchError) {
    console.error('Error checking profile:', fetchError.message)
    return NextResponse.redirect(new URL('/login?message=Profile%20check%20error', url.origin))
  }

  if (!existingProfile) {
    const { error: insertError } = await supabase.from('profiles').insert({
      id: user.id,
      has_paid_number: false,
    })
    if (insertError) {
      console.error('Error creating profile:', insertError.message)
      return NextResponse.redirect(new URL('/login?message=Error%20creating%20profile', url.origin))
    }
  }

  return NextResponse.redirect(new URL('/dashboard', url.origin))
}
