'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface AddContactModalProps {
  open: boolean
  onClose: () => void
  onSave: (newContact: Contact) => void
}

interface Contact {
  id: string
  phone_number: string
  first_name: string
  last_name: string
  created_at: string
}

export default function AddContactModal({
  open,
  onClose,
  onSave,
}: AddContactModalProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)

    const res = await fetch('/api/contacts/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      onSave(data.contact)
      setFirstName('')
      setLastName('')
      setPhoneNumber('')
    } else {
      console.error(data.error || 'Failed to add contact')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-700">First Name</label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Required"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-700">Last Name</label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-700">Phone Number</label>
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Required"
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={loading || !firstName || !phoneNumber}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {loading ? 'Saving...' : 'Add Contact'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
