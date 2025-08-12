'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { User } from 'lucide-react'
import GetCreditsModal from '@/components/GetCreditsModal'

type ProfileRow = {
  id: string
  credits: number | null
  created_at: string | null
}

export default function AuthNavbar() {
  const pathname = usePathname()
  const router = useRouter()

  const hideNavbarRoutes = ['/', '/login', '/signup']
  const shouldHide = hideNavbarRoutes.includes(pathname)

  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCreditsModal, setShowCreditsModal] = useState(false)

  useEffect(() => {
    if (shouldHide) return

    let isMounted = true
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/profiles/get', { method: 'GET' })
        const data = await res.json()
        if (res.ok && isMounted) {
          setProfile(data.profile ?? null)
        }
      } catch (e) {
        console.error('Failed to load profile:', e)
      } finally {
        if (isMounted) setLoading(false)
      }
    })()

    return () => {
      isMounted = false
    }
  }, [shouldHide])

  if (shouldHide) return null

  const credits =
    loading ? null : typeof profile?.credits === 'number' ? profile.credits : 0

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-30 border-b border-zinc-200 bg-zinc-50 h-14">
        <div className="pl-60 max-w-full px-6 py-3">
          <div className="flex items-center justify-between">
            <div />

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreditsModal(true)}
                className="rounded-md border border-zinc-200 bg-zinc-100 px-3 py-1 text-sm text-zinc-800 hover:bg-zinc-200 transition"
              >
                <span className="font-medium">Credits:</span>{' '}
                {credits === null ? (
                  <span className="inline-block h-3 w-8 align-middle rounded bg-zinc-300 animate-pulse cursor-pointer" />
                ) : (
                  <span className="font-semibold">{credits}</span>
                )}
              </button>

              <button
                type="button"
                aria-label="User menu"
                onClick={() => router.push('/settings')}
                className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white p-2 hover:bg-zinc-100 transition cursor-pointer"
              >
                <User className="h-5 w-5 text-zinc-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {showCreditsModal && (
        <GetCreditsModal
          open={showCreditsModal}
          onClose={() => setShowCreditsModal(false)}
        />
      )}
    </>
  )
}
