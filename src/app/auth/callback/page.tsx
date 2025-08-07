'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function OAuthCallbackHandler() {
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkSessionAndSetupProfile = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (!session?.user || sessionError) {
        router.push('/login')
        return
      }

      const userId = session.user.id

      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle()

      if (!existingProfile) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: userId,
          has_paid_number: false,
        })

        if (profileError) {
          console.error('Error creating profile:', profileError.message)
          router.push('/login?message=Error creating profile')
          return
        }
      }

      router.push('/dashboard')
    }

    checkSessionAndSetupProfile()
  }, [router, supabase])

  return <p className="text-center mt-20 text-zinc-600">Signing you in...</p>
}