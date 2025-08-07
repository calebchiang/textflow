'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function OAuthCallbackHandler() {
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (!session?.user || error) {
        router.push('/login')
        return
      }

      router.push('/dashboard')
    }

    checkSession()
  }, [router, supabase])

  return <p className="text-center mt-20 text-zinc-600">Signing you in...</p>
}
