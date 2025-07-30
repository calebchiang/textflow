'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Contact {
  id: string
  phone_number: string
  first_name: string | null
  last_name: string | null
}

interface AddConversationModalProps {
  open: boolean
  onClose: () => void
}

const existingConversations = ['123', '456'] 

export default function AddConversationModal({ open, onClose }: AddConversationModalProps) {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [recipient, setRecipient] = useState('')
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [step, setStep] = useState<1 | 2>(1)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!open) return

    setStep(1)
    setRecipient('')
    setSelectedContact(null)
    setMessage('')

    const fetchContacts = async () => {
      try {
        const res = await fetch('/api/contacts/get')
        const { contacts } = await res.json()
        setContacts(contacts)
      } catch (err) {
        console.error('Error fetching contacts:', err)
      }
    }
    fetchContacts()
  }, [open])

  const filteredContacts = recipient.trim()
    ? contacts.filter((c) => {
        const query = recipient.toLowerCase()
        return (
          c.first_name?.toLowerCase().includes(query) ||
          c.last_name?.toLowerCase().includes(query) ||
          c.phone_number.includes(query)
        )
      })
    : []

  const handleSelect = (contact: Contact) => {
    const exists = existingConversations.includes(contact.id)

    if (exists) {
      onClose()
    } else {
      setSelectedContact(contact)
      setStep(2)
    }
  }

  const handleSend = () => {
    if (!message.trim()) return
    console.log('Sending message:', message)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md h-[500px] flex flex-col">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <>
            <div className="py-2 space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-zinc-700 w-10 shrink-0">To:</label>
                <Input
                  placeholder="Enter name or phone number"
                  value={recipient}
                  onChange={(e) => {
                    setRecipient(e.target.value)
                    setSelectedContact(null)
                  }}
                />
              </div>
            </div>

            {filteredContacts.length > 0 && !selectedContact && (
              <div className="flex-grow border rounded-md my-2 overflow-y-auto">
                {filteredContacts.map((c) => {
                  const name = [c.first_name, c.last_name].filter(Boolean).join(' ')
                  return (
                    <div
                      key={c.id}
                      onClick={() => handleSelect(c)}
                      className={cn(
                        'px-3 py-2 hover:bg-zinc-100 cursor-pointer border-b last:border-b-0 text-sm'
                      )}
                    >
                      <p className="font-medium">{name || c.phone_number}</p>
                      {name && <p className="text-zinc-500 text-xs">{c.phone_number}</p>}
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {step === 2 && selectedContact && (
          <div className="mt-4 space-y-4">
            <p className="text-sm text-zinc-600">
              To:{' '}
              <span className="font-medium">
                {[selectedContact.first_name, selectedContact.last_name].filter(Boolean).join(' ') ||
                  selectedContact.phone_number}
              </span>
            </p>
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button onClick={handleSend} className="bg-emerald-600 hover:bg-emerald-700">
              Send
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
