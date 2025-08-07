'use client'

import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'

interface GetPhoneNumberProps {
  onOpenModal: () => void
}

export default function GetPhoneNumber({ onOpenModal }: GetPhoneNumberProps) {
  return (
    <section className="w-full max-w-3xl mt-4 bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
      <div className="flex justify-center mb-2">
        <div className="flex items-center gap-2 text-center">
          <MessageCircle className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-semibold text-zinc-800">
            Set Up Your Phone Number
          </h2>
        </div>
      </div>

      <p className="text-zinc-600 mb-4 text-center">
        Choose a dedicated phone number for sending and receiving SMS messages.
        This number will represent your business and allow you to start messaging clients directly.
      </p>

      <div className="flex justify-center">
        <Button onClick={onOpenModal}>
          Set Up My Phone Number
        </Button>
      </div>
    </section>
  )
}
