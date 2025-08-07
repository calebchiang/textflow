'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function OAuthCallbackHandler() {
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    // Listen for when the session becomes available
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Optional: set up profile here if needed
        router.push('/dashboard')
      }
    })

    // Cleanup the listener on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  return <p className="text-center mt-20 text-zinc-600">Signing you in...</p>
}
