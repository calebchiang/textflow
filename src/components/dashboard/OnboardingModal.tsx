'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

interface OnboardingModalProps {
  open: boolean
  onClose: () => void
}

export default function OnboardingModal({ open, onClose }: OnboardingModalProps) {
  const [country, setCountry] = useState('')

  const handleNext = () => {
    // Logic to proceed to next step (e.g., update step state)
    console.log('Next step with country:', country)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center justify-center pt-4">
          <Image
            src="/logo_4.png"
            alt="Logo"
            width={80}
            height={80}
            className="mb-4 rounded-xl"
          />
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-zinc-800 text-center w-full">
              Welcome to TextFlow 👋
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="text-zinc-700 text-sm text-center mb-4">
          Let’s get your account set up and ready to go.
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-zinc-700 mb-2 text-center">
            Where is your business based?
          </label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="canada">🇨🇦 Canada</SelectItem>
              <SelectItem value="us">🇺🇸 United States</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="mt-6 flex justify-between gap-2">
          <DialogClose asChild>
            <Button variant="ghost">Close</Button>
          </DialogClose>
          <Button onClick={handleNext} disabled={!country}>
            Next
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
