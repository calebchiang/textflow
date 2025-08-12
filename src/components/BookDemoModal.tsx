'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check } from 'lucide-react'
import { useState, useMemo } from 'react'
import { toast } from 'sonner'

interface BookDemoModalProps {
  open: boolean
  onClose: () => void
}

export default function BookDemoModal({ open, onClose }: BookDemoModalProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const emailValid = useMemo(() => {
    const v = email.trim()
    if (!v) return false
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  }, [email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailValid || loading) return

    try {
      setLoading(true)
      const res = await fetch('/api/book-demos/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to submit')
      }

      toast.success('Thanks! Monitor your inbox for our email.')
      setEmail('')
      onClose()
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book a 15-Minute Demo (Free)</DialogTitle>
          <DialogDescription>
            Drop your email and we’ll reach out to schedule a quick call. No pressure, just answers.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <ul className="space-y-2 text-sm text-zinc-700">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 mt-0.5 text-emerald-600" />
              <span><strong>Fast setup:</strong> see how to launch your first SMS campaign in minutes.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 mt-0.5 text-emerald-600" />
              <span><strong>Clear pricing:</strong> pay-per-message, no monthly lock-ins.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 mt-0.5 text-emerald-600" />
              <span><strong>Guided compliance:</strong> simple walkthrough of best practices.</span>
            </li>
          </ul>

          <p className="text-sm text-zinc-600">
            Enter your email below. Someone from our team will email you to book a quick 15-minute call
            and answer any questions.
          </p>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-800">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button type="button" variant="ghost">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={!emailValid || loading}
            >
              {loading ? 'Submitting…' : 'Submit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
