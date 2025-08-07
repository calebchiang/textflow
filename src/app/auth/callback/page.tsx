'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function OAuthCallbackHandler() {
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.search
      )

      if (error) {
        console.error('Error during OAuth callback:', error)
        router.push('/login')
        return
      }

      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        router.push('/dashboard')
      } else {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (event === 'SIGNED_IN' && session) {
              router.push('/dashboard')
              subscription.unsubscribe()
            }
          }
        )
      }
    }

    handleCallback()
  }, [router, supabase])

  return <p className="text-center mt-20 text-zinc-600">Signing you in...</p>
}